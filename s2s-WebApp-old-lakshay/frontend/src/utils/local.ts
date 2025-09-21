const { window } = globalThis

const local = {
  clear: () => {
    const { localStorage } = window
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth')
    localStorage.removeItem('bearerToken')
    localStorage.clear()
  },
  getItem: (item_name: any) => {
    const { localStorage } = window
    return localStorage.getItem(`SYNTH::${item_name}`)
  },
  setItem: (itemName: any, value: any) => {
    const { localStorage } = window
    return localStorage.setItem(`SYNTH::${itemName}`, value)
  },
}

export default local
