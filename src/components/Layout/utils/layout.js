const removeCell = (config, cellId) => {
  if (config.id === cellId) return config
  if (config.children) {
    let found = false
    config.children.forEach(child => {
      const result = removeCell(child, cellId)
      if(result) {
        found = result
        delete(result)
      }
    })
    return found
  }
  return false
}

const moveElementToNewPosition = (layoutJson, cellId, parentId, prevSiblingId) => {
  cellConfig = removeCell(layoutJson, cellId)
  debugger
}

export default {
  moveElementToNewPosition,
}
