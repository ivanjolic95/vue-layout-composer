import _ from 'lodash'

const addIds = (jsonConfig, startAt = 0) => {
  function _addIds(config) {
    if (!config) return
  
    config.id = startAt++
  
    if (!config.children) return
    config.children.forEach(el => {
      _addIds(el)
    })
  }

  return _addIds(jsonConfig)
}

const removeIds = (jsonConfig) => {
  function _removeIds(config) {
    if (!config) return

    delete config['id']

    if (!config.children) return
    config.children.forEach(el => {
      _removeIds(el)
    })
  }

  return _removeIds(jsonConfig)
}

const addMargins = (jsonConfig) => {
  function _addMargins(config) {
    if (!config) return
    if (config.component !== 'Layout') return

    if (config.props && config.props.orientation === 'horizontal') {
      config.children = [
        {
          ...config.children[0],
          internalDisplay: {
            marginTop: null,
            marginLeft: null,
          },
        },
        ...config.children.slice(1).map(child => ({
          ...child,
          internalDisplay: {
            marginLeft: '8px',
            marginTop: null,
          },
        })),
      ]
    }

    if (config.props && config.props.orientation === 'vertical') {
      config.children = [
        {
          ...config.children[0],
          internalDisplay: {
            marginTop: null,
            marginLeft: null,
          },
        },
        ...config.children.slice(1).map(child => ({
          ...child,
          internalDisplay: {
            marginLeft: null,
            marginTop: '8px',
          },
        })),
      ]
    }

    if (!config.children) return
    config.children.forEach(child => _addMargins(child))
  }

  _addMargins(jsonConfig)
}

const removeCell = (config, cellId, parent = null, index = null) => {
  if (cellId === 0) {
    return false
  }
  if (config && config.id === cellId) {
    const result = { ...config }
    delete parent.children[index]
    parent.children = parent.children.filter(child => child)
    return result
  }
  if (config && config.children) {
    let found = false
    for (let [index, child] of config.children.entries()) {
      const result = removeCell(child, cellId, config, index)
      found = result
      if (result) break
    }
    return found
  }
  return false
}

const addCell = (config, cell, parentId, prevSiblingId) => {
  if (config && config.id === parentId) {
    if (prevSiblingId) {
      const prevSiblingIndex = config.children.findIndex(child => child && child.id === prevSiblingId)
      config.children = [
        ...config.children.slice(0, prevSiblingIndex + 1),
        cell,
        ...config.children.slice(prevSiblingIndex + 1),
      ].filter(child => child)
    } else {
      config.children = [
        cell,
        ...config.children,
      ].filter(child => child)
    }

    return
  }

  if (config && config.children) {
    for (let child of config.children) {
      addCell(child, cell, parentId, prevSiblingId)
    }
  }
}

const moveElementToNewLayout = (cellConfig, prevParentLayoutJson, nextParentLayoutJson, cellId, parentId, prevSiblingId) => {
  const newPrevParentLayoutJson = _.cloneDeep(prevParentLayoutJson)
  const newNextParentLayoutJson = _.cloneDeep(nextParentLayoutJson)
  removeCell(newPrevParentLayoutJson, cellId)
  addCell(newNextParentLayoutJson, cellConfig, parentId, prevSiblingId)
  addMargins(newPrevParentLayoutJson)
  addMargins(newNextParentLayoutJson)
  return { newPrevParentLayoutJson, newNextParentLayoutJson }
}

const moveElementToNewPositionInLayout = (cellConfig, prevParentLayoutJson, cellId, parentId, prevSiblingId) => {
  const newPrevParentLayoutJson = _.cloneDeep(prevParentLayoutJson)
  removeCell(newPrevParentLayoutJson, cellId)
  addCell(newPrevParentLayoutJson, cellConfig, parentId, prevSiblingId)
  addMargins(newPrevParentLayoutJson)
  return { newPrevParentLayoutJson, newNextParentLayoutJson: null }
}

const moveElementToNewPosition = (cellConfig, prevParentLayoutJson, nextParentLayoutJson, cellId, parentId, prevParentId, prevSiblingId) => {
  let newPrevParentLayoutJson, newNextParentLayoutJson
  
  if (parentId !== prevParentId) {
    ({ newPrevParentLayoutJson, newNextParentLayoutJson } = moveElementToNewLayout(cellConfig, prevParentLayoutJson, nextParentLayoutJson, cellId, parentId, prevSiblingId))
  } else {
    ({ newPrevParentLayoutJson, newNextParentLayoutJson } = moveElementToNewPositionInLayout(cellConfig, prevParentLayoutJson, cellId, parentId, prevSiblingId))
  }

  return { newPrevParentLayoutJson, newNextParentLayoutJson }
}

export default {
  moveElementToNewPosition,
  addIds,
  removeIds,
  addMargins,
  removeCell,
}
