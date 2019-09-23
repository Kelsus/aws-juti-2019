export const getInit = (options = {}) => {
  return {
    ...options,
    headers: { 'x-api-key': 'some-api-key' }
  }
}