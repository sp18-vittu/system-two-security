export const SelectMessage = (id: string) => ({
  type: 'SELECT_MESSAGE',
  id: id,
})

export const LoadMessages = () => ({
  type: 'LOAD_MESSAGES',
})
