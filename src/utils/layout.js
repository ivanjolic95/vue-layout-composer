let globalId = 0

function _addIds(jsonConfig) {
  if (!jsonConfig) return

  jsonConfig.id = globalId
  globalId++

  if (!jsonConfig.children) return
  jsonConfig.children.forEach(el => {
    _addIds(el)
  })
}

export const addIds = jsonConfig => {
  return _addIds(jsonConfig)
}
