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
const BACK_PATH = '/moderador/apps'

const activities = ref<any[]>([])
const withdrawals = ref<any[]>([])
const agencies = ref<any[]>([])
const agencyCodes = ref<any[]>([])
const contacts = ref<any[]>([])
const links = ref<any[]>([])
const currencyConversions = ref<any[]>([])
const incomeSources = ref<any[]>([])

const modal = ref<{ type: string; open: boolean; data: any }>({ type: '', open: false, data: {} })

async function loadAll() {
  const [a, act, wd, ag, ac, ct, lk, cc, is] = await Promise.all([
    supabase.from('apps').select('*').eq('id', appId).single(),
    supabase.from('app_activities').select('*').eq('app_id', appId).order('sort_order'),
    supabase.from('app_withdrawal_methods').select('*').eq('app_id', appId),
    supabase.from('app_agencies').select('*').eq('app_id', appId),
    supabase.from('app_agency_codes').select('*').eq('app_id', appId),
    supabase.from('app_contacts').select('*').eq('app_id', appId).order('sort_order'),
    supabase.from('app_links').select('*').eq('app_id', appId).order('sort_order'),
    supabase.from('app_currency_conversions').select('*').eq('app_id', appId),
    supabase.from('app_income_sources').select('*').eq('app_id', appId).order('sort_order')
  ])
  app.value = a.data
  activities.value = act.data ?? []
  withdrawals.value = wd.data ?? []
  agencies.value = ag.data ?? []
  agencyCodes.value = ac.data ?? []
  contacts.value = ct.data ?? []
  links.value = lk.data ?? []
  currencyConversions.value = cc.data ?? []
  incomeSources.value = is.data ?? []
}
onMounted(loadAll)

const TABLES: Record<string, string> = {
  activity: 'app_activities',
  withdrawal: 'app_withdrawal_methods',
  agency: 'app_agencies',
  agencyCode: 'app_agency_codes',
  contact: 'app_contacts',
  link: 'app_links',
  currency: 'app_currency_conversions',
  income: 'app_income_sources'
}

function openNew(type: string) {
  const defaults: Record<string, any> = {
    activity: { app_id: appId, name: '', reward_value: 0, reward_unit: 'frijoles', is_active: true, sort_order: 0 },
    withdrawal: { app_id: appId, name: '', frequency: '', frequency_type: 'weekly', is_active: true },
    agency: { app_id: appId, name: '', is_active: true },
    agencyCode: { app_id: appId, agency_id: null, code: '', is_active: true, is_copyable: true },
    contact: { app_id: appId, type: 'whatsapp', title: '', url: '', is_active: true, sort_order: 0 },
    link: { app_id: appId, type: 'android', title: '', url: '', is_active: true, sort_order: 0 },
    currency: { app_id: appId, unit_name: '', units_per_usd: 1, is_active: true },
    income: { app_id: appId, name: '', unit: 'USD', value: 0, is_active: true, sort_order: 0 }
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

const FREQUENCY_LABELS: Record<string, string> = { daily: 'Diario', weekly: 'Semanal', monthly: 'Mensual', accumulated: 'Acumulable' }
</script>

<template>
  <div v-if="app">
    <button class="back" @click="router.push(BACK_PATH)">← Volver a aplicaciones</button>
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

    <!-- CONVERSIÓN DE MONEDA -->
    <BaseCard class="section">
      <div class="section__head"><h2>Conversión a USD</h2><BaseButton size="sm" @click="openNew('currency')">+ Agregar</BaseButton></div>
      <table class="table">
        <tbody>
          <tr v-for="c in currencyConversions" :key="c.id">
            <td>{{ c.units_per_usd }} {{ c.unit_name }} = 1 USD</td>
            <td class="actions"><BaseButton size="sm" variant="secondary" @click="openEdit('currency', c)">Editar</BaseButton><BaseButton size="sm" variant="outline" @click="remove('currency', c)">Eliminar</BaseButton></td>
          </tr>
        </tbody>
      </table>
    </BaseCard>

    <!-- FUENTES DE INGRESO -->
    <BaseCard class="section">
      <div class="section__head"><h2>Otros métodos de ingreso (llamadas privadas, etc.)</h2><BaseButton size="sm" @click="openNew('income')">+ Agregar</BaseButton></div>
      <table class="table">
        <thead><tr><th>Nombre</th><th>Duración</th><th>Valor</th><th>USD/min</th><th>Pts/min</th><th></th></tr></thead>
        <tbody>
          <tr v-for="s in incomeSources" :key="s.id">
            <td>{{ s.name }}</td><td>{{ s.duration_label || '—' }}</td><td>{{ s.value }} {{ s.unit }}</td>
            <td>{{ s.usd_per_min || '—' }}</td><td>{{ s.points_per_min || '—' }}</td>
            <td class="actions"><BaseButton size="sm" variant="secondary" @click="openEdit('income', s)">Editar</BaseButton><BaseButton size="sm" variant="outline" @click="remove('income', s)">Eliminar</BaseButton></td>
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
            <td>{{ w.name }}</td><td>{{ FREQUENCY_LABELS[w.frequency_type] || w.frequency || '—' }}</td>
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
        <BaseSelect v-if="modal.type === 'withdrawal'" v-model="modal.data.frequency_type" label="Frecuencia de retiro" :options="[{value:'daily',label:'Diario'},{value:'weekly',label:'Semanal'},{value:'monthly',label:'Mensual'},{value:'accumulated',label:'Acumulable'}]" />
        <BaseInput v-if="modal.type === 'withdrawal'" v-model="modal.data.frequency" label="Detalle adicional (opcional)" />
        <BaseInput v-if="'minimum_amount' in modal.data || modal.type === 'withdrawal'" v-model.number="modal.data.minimum_amount" type="number" label="Monto mínimo" />
        <BaseInput v-if="'requirements' in modal.data || modal.type === 'withdrawal' || modal.type === 'agency'" v-model="modal.data.requirements" label="Requisitos" />
        <BaseSelect v-if="modal.type === 'contact'" v-model="modal.data.type" label="Tipo de contacto" :options="[{value:'whatsapp',label:'WhatsApp'},{value:'telegram',label:'Telegram'},{value:'email',label:'Email'},{value:'other',label:'Otro'}]" />
        <BaseSelect v-if="modal.type === 'link'" v-model="modal.data.type" label="Tipo de enlace" :options="[{value:'android',label:'Android'},{value:'ios',label:'iOS'},{value:'website',label:'Sitio web'},{value:'download',label:'Descarga'},{value:'other',label:'Otro'}]" />
        <BaseInput v-if="modal.type === 'currency'" v-model="modal.data.unit_name" label="Nombre de la unidad (ej. frijoles)" />
        <BaseInput v-if="modal.type === 'currency'" v-model.number="modal.data.units_per_usd" type="number" label="Cantidad de unidades = 1 USD" />
        <BaseInput v-if="modal.type === 'income'" v-model="modal.data.source_type" label="Tipo (ej. llamada privada, regalo...)" />
        <BaseInput v-if="modal.type === 'income'" v-model="modal.data.duration_label" label="Duración (ej. 1-5 min, por evento...)" />
        <BaseInput v-if="modal.type === 'income'" v-model.number="modal.data.value" type="number" label="Valor" />
        <BaseInput v-if="modal.type === 'income'" v-model="modal.data.unit" label="Unidad del valor (USD, puntos, frijoles...)" />
        <BaseInput v-if="modal.type === 'income'" v-model.number="modal.data.usd_per_min" type="number" label="USD por minuto (opcional)" />
        <BaseInput v-if="modal.type === 'income'" v-model.number="modal.data.points_per_min" type="number" label="Puntos por minuto (opcional)" />
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
.table td, .table th { padding: var(--space-2) var(--space-3); border-bottom: 1px solid var(--color-border); font-size: var(--fs-sm); text-align: left; }
.actions { display: flex; gap: var(--space-2); justify-content: flex-end; }
.form { display: flex; flex-direction: column; gap: var(--space-4); }
</style>
