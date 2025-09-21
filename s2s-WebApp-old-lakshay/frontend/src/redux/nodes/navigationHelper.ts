let navigateFn: (path: string) => void

export const setNavigate = (navigate: (path: string) => void) => {
  navigateFn = navigate
}

export const navigateTo = (path: string) => {
  if (navigateFn) {
    navigateFn(path)
  }
}
