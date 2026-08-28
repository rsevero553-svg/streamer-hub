import { watch, type Ref } from 'vue'

export function useMeta(title: Ref<string> | string, description?: Ref<string> | string) {
  const setTitle = (t: string) => { document.title = t ? `${t} · Streamer Hub` : 'Streamer Hub' }
  const setDescription = (d: string) => {
    let tag = document.querySelector('meta[name="description"]')
    if (!tag) {
      tag = document.createElement('meta')
      tag.setAttribute('name', 'description')
      document.head.appendChild(tag)
    }
    tag.setAttribute('content', d)
  }

  if (typeof title === 'string') setTitle(title)
  else { setTitle(title.value); watch(title, (v) => setTitle(v)) }

  if (description) {
    if (typeof description === 'string') setDescription(description)
    else { setDescription(description.value); watch(description, (v) => setDescription(v)) }
  }
}
