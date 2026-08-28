<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { supabase } from '@/services/supabase'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import BaseModal from '@/components/ui/BaseModal.vue'

const route = useRoute()
const router = useRouter()
const appId = route.params.id as string
const app = ref<any>(null)

const activities = ref<any[]>([])
const withdrawals = ref<any[]>([])
const agencies = ref<any[]>([])
const agencyCodes = ref<any[]>([])
const contacts = ref<any[]>([])
const links = ref<any[]>([])

const modal = ref<{ type: string; open: boolean; data: any }>({ type: '', open: false, data: {} })

async function loadAll() {
  const [a, act, wd, ag, ac, ct, lk] = await Promise.all([
    supabase.from('apps').select('*').eq('id', appId).single(),
    supabase.from('app_activities').select('*').eq('app_id', appId).order('sort_order'),
    supabase.from('app_withdrawal_methods').select('*').eq('app_id', appId),
    supabase.from('app_agencies').select('*').eq('app_id', appId),
    supabase.from('app_agency_codes').select('*').eq('app_id', appId),
    supabase.from('app_contacts').select('*').eq('app_id', appId).order('sort_order'),
    supabase.from('app_links').select('*').eq('app_id', appId).order('sort_order')
  ])
  app.value = a.data
  activities.value = act.data ?? []
  withdrawals.value = wd.data ?? []
  agencies.value = ag.data ?? []
  agencyCodes.value = ac.data ?? []
  contacts.value = ct.data ?? []
  links.value = lk.data ?? []
}
onMounted(loadAll)

const TABLES: Record<string, string> = {
  activity: 'app_activities',
  withdrawal: 'app_withdrawal_methods',
  agency: 'app_agencies',
  agencyCode: 'app_agency_codes',
  contact: 'app_contacts',
  link: 'app_links'
}

function openNew(type: string) {
  const defaults: Record<string, any> = {
    activity: { app_id: appId, name: '', reward_value: 0, reward_unit: 'frijoles', is_active: true, sort_order: 0 },
    withdrawal: { app_id: appId, name: '', frequency: '', is_active: true },
    agency: { app_id: appId, name: '', is_active: true },
    agencyCode: { app_id: appId, agency_id: null, code: '', is_active: true, is_copyable: true },
    contact: { app_id: appId, type: 'whatsapp', title: '', url: '', is_active: true, sort_order: 0 },
    link: { app_id: appId, type: 'android', title: '', url: '', is_active: true, sort_order: 0 }
  }
  modal.value = { type, open: true, data: { ...defaults[type] } }
}
function openEdit(type: string, row: any) {
  modal.value = { type, open: true, data: { ...row } }
}
async function save() {
  const table = TABLES[modal.value.type]
  const data = modal.value.data
  if (data.id) await supabase.from(table).update(data).eq('id', data.id)
  else await supabase.from(table).insert(data)
  modal.value.open = false
  await loadAll()
}
async function remove(type: string, row: any) {
  if (!confirm('¿Eliminar este registro?')) return
  await supabase.from(TABLES[type]).delete().eq('id', row.id)
  await loadAll()
}
</script>

<template>
  <div v-if="app">
    <button class="back" @click="router.push('/admin/apps')">← Volver a aplicaciones</button>
    <h1 class="title">{{ app.name }}</h1>

    <!-- ACTIVIDADES -->
    <BaseCard class="section">
      <div class="section__head"><h2>Actividades y recompensas</h2><BaseButton size="sm" @click="openNew('activity')">+ Agregar</BaseButton></div>
      <table class="table">
        <tbody>
          <tr v-for="a in activities" :key="a.id">
            <td>{{ a.name }}</td><td>{{ a.reward_value }} {{ a.reward_unit }}</td>
            <td class="actions"><BaseButton size="sm" variant="secondary" @click="openEdit('activity', a)">Editar</BaseButton><BaseButton size="sm" variant="outline" @click="remove('activity', a)">Eliminar</BaseButton></td>
          </tr>
        </tbody>
      </table>
    </BaseCard>

    <!-- RETIROS -->
    <BaseCard class="section">
      <div class="section__head"><h2>Métodos de retiro</h2><BaseButton size="sm" @click="openNew('withdrawal')">+ Agregar</BaseButton></div>
      <table class="table">
        <tbody>
          <tr v-for="w in withdrawals" :key="w.id">
            <td>{{ w.name }}</td><td>{{ w.frequency }}</td>
            <td class="actions"><BaseButton size="sm" variant="secondary" @click="openEdit('withdrawal', w)">Editar</BaseButton><BaseButton size="sm" variant="outline" @click="remove('withdrawal', w)">Eliminar</BaseButton></td>
          </tr>
        </tbody>
      </table>
    </BaseCard>

    <!-- AGENCIAS -->
    <BaseCard class="section">
      <div class="section__head"><h2>Agencias</h2><BaseButton size="sm" @click="openNew('agency')">+ Agregar</BaseButton></div>
      <table class="table">
        <tbody>
          <tr v-for="a in agencies" :key="a.id">
            <td>{{ a.name }}</td>
            <td class="actions"><BaseButton size="sm" variant="secondary" @click="openEdit('agency', a)">Editar</BaseButton><BaseButton size="sm" variant="outline" @click="remove('agency', a)">Eliminar</BaseButton></td>
          </tr>
        </tbody>
      </table>
    </BaseCard>

    <!-- CODIGOS DE AGENCIA -->
    <BaseCard class="section">
      <div class="section__head"><h2>Códigos de agencia</h2><BaseButton size="sm" @click="openNew('agencyCode')">+ Agregar</BaseButton></div>
      <table class="table">
        <tbody>
          <tr v-for="c in agencyCodes" :key="c.id">
            <td><code>{{ c.code }}</code></td>
            <td class="actions"><BaseButton size="sm" variant="secondary" @click="openEdit('agencyCode', c)">Editar</BaseButton><BaseButton size="sm" variant="outline" @click="remove('agencyCode', c)">Eliminar</BaseButton></td>
          </tr>
        </tbody>
      </table>
    </BaseCard>

    <!-- CONTACTOS -->
    <BaseCard class="section">
      <div class="section__head"><h2>Contactos (WhatsApp / Telegram)</h2><BaseButton size="sm" @click="openNew('contact')">+ Agregar</BaseButton></div>
      <table class="table">
        <tbody>
          <tr v-for="c in contacts" :key="c.id">
            <td>{{ c.type }}</td><td>{{ c.title }}</td>
            <td class="actions"><BaseButton size="sm" variant="secondary" @click="openEdit('contact', c)">Editar</BaseButton><BaseButton size="sm" variant="outline" @click="remove('contact', c)">Eliminar</BaseButton></td>
          </tr>
        </tbody>
      </table>
    </BaseCard>

    <!-- ENLACES -->
    <BaseCard class="section">
      <div class="section__head"><h2>Enlaces oficiales</h2><BaseButton size="sm" @click="openNew('link')">+ Agregar</BaseButton></div>
      <table class="table">
        <tbody>
          <tr v-for="l in links" :key="l.id">
            <td>{{ l.type }}</td><td>{{ l.title }}</td>
            <td class="actions"><BaseButton size="sm" variant="secondary" @click="openEdit('link', l)">Editar</BaseButton><BaseButton size="sm" variant="outline" @click="remove('link', l)">Eliminar</BaseButton></td>
          </tr>
        </tbody>
      </table>
    </BaseCard>

    <BaseModal :open="modal.open" title="Editar registro" @close="modal.open = false">
      <div class="form">
        <BaseInput v-if="'name' in modal.data" v-model="modal.data.name" label="Nombre" />
        <BaseInput v-if="'title' in modal.data" v-model="modal.data.title" label="Título" />
        <BaseInput v-if="'code' in modal.data" v-model="modal.data.code" label="Código" />
        <BaseInput v-if="'url' in modal.data" v-model="modal.data.url" label="URL" />
        <BaseInput v-if="'reward_value' in modal.data" v-model.number="modal.data.reward_value" type="number" label="Valor de recompensa" />
        <BaseInput v-if="'reward_unit' in modal.data" v-model="modal.data.reward_unit" label="Unidad (frijoles, puntos, USD...)" />
        <BaseInput v-if="'frequency' in modal.data" v-model="modal.data.frequency" label="Frecuencia de retiro" />
        <BaseInput v-if="'minimum_amount' in modal.data || modal.type === 'withdrawal'" v-model.number="modal.data.minimum_amount" type="number" label="Monto mínimo" />
        <BaseInput v-if="'requirements' in modal.data || modal.type === 'withdrawal' || modal.type === 'agency'" v-model="modal.data.requirements" label="Requisitos" />
        <BaseSelect v-if="modal.type === 'contact'" v-model="modal.data.type" label="Tipo de contacto" :options="[{value:'whatsapp',label:'WhatsApp'},{value:'telegram',label:'Telegram'},{value:'email',label:'Email'},{value:'other',label:'Otro'}]" />
        <BaseSelect v-if="modal.type === 'link'" v-model="modal.data.type" label="Tipo de enlace" :options="[{value:'android',label:'Android'},{value:'ios',label:'iOS'},{value:'website',label:'Sitio web'},{value:'download',label:'Descarga'},{value:'other',label:'Otro'}]" />
        <BaseButton @click="save">Guardar</BaseButton>
      </div>
    </BaseModal>
  </div>
</template>

<style scoped>
.back { background: none; border: none; color: var(--color-text-muted); margin-bottom: var(--space-4); font-size: var(--fs-sm); }
.title { font-family: var(--font-display); font-size: var(--fs-2xl); margin-bottom: var(--space-6); }
.section { margin-bottom: var(--space-5); }
.section__head { display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-3); }
.section__head h2 { font-size: var(--fs-md); }
.table { width: 100%; border-collapse: collapse; }
.table td { padding: var(--space-2) var(--space-3); border-bottom: 1px solid var(--color-border); font-size: var(--fs-sm); }
.actions { display: flex; gap: var(--space-2); justify-content: flex-end; }
.form { display: flex; flex-direction: column; gap: var(--space-4); }
</style>
