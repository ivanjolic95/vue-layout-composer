/* eslint-disable no-param-reassign */
import _ from 'lodash'

const addIds = (jsonConfig, startAt = 0) => {
  function _addIds(config) {
    if (!config) return

    config.id = startAt
    startAt += 1

    if (!config.children) return
    config.children.forEach(el => {
      _addIds(el)
    })
  }

  return _addIds(jsonConfig)
}

const removeIds = jsonConfig => {
  function _removeIds(config) {
    if (!config) return

    delete config.id

    if (!config.children) return
    config.children.forEach(el => {
      _removeIds(el)
    })
  }

  return _removeIds(jsonConfig)
}

const removeCell = (config, cellId) => {
  if (cellId === 0) {
    return
  }

  if (config && config.children) {
    config.children = config.children.filter(child => child.id !== cellId)
  }
}

const addCell = (config, cell, parentId, prevSiblingId) => {
  if (config && config.id === parentId) {
    if (prevSiblingId) {
      const prevSiblingIndex = config.children.findIndex(
        child => child && child.id === prevSiblingId
      )
      config.children = [
        ...config.children.slice(0, prevSiblingIndex + 1),
        cell,
        ...config.children.slice(prevSiblingIndex + 1),
      ].filter(child => child)
    } else {
      config.children = [cell, ...config.children].filter(child => child)
    }

    return
  }

  if (config && config.children) {
    config.children.forEach(child => {
      addCell(child, cell, parentId, prevSiblingId)
    })
  }
}

const moveElementToNewLayout = (
  cellConfig,
  prevParentLayoutJson,
  nextParentLayoutJson,
  cellId,
  parentId,
  prevSiblingId
) => {
  const newPrevParentLayoutJson = _.cloneDeep(prevParentLayoutJson)
  const newNextParentLayoutJson = _.cloneDeep(nextParentLayoutJson)
  removeCell(newPrevParentLayoutJson, cellId)
  addCell(newNextParentLayoutJson, cellConfig, parentId, prevSiblingId)
  return { newPrevParentLayoutJson, newNextParentLayoutJson }
}

const moveElementToNewPositionInLayout = (
  cellConfig,
  prevParentLayoutJson,
  cellId,
  parentId,
  prevSiblingId
) => {
  const newPrevParentLayoutJson = _.cloneDeep(prevParentLayoutJson)
  removeCell(newPrevParentLayoutJson, cellId)
  addCell(newPrevParentLayoutJson, cellConfig, parentId, prevSiblingId)
  return { newPrevParentLayoutJson, newNextParentLayoutJson: null }
}

const moveElementToNewPosition = (
  cellConfig,
  prevParentLayoutJson,
  nextParentLayoutJson,
  cellId,
  parentId,
  prevParentId,
  prevSiblingId
) => {
  let newPrevParentLayoutJson
  let newNextParentLayoutJson

  if (parentId !== prevParentId) {
    ;({
      newPrevParentLayoutJson,
      newNextParentLayoutJson,
    } = moveElementToNewLayout(
      cellConfig,
      prevParentLayoutJson,
      nextParentLayoutJson,
      cellId,
      parentId,
      prevSiblingId
    ))
  } else {
    ;({
      newPrevParentLayoutJson,
      newNextParentLayoutJson,
    } = moveElementToNewPositionInLayout(
      cellConfig,
      prevParentLayoutJson,
      cellId,
      parentId,
      prevSiblingId
    ))
  }

  return { newPrevParentLayoutJson, newNextParentLayoutJson }
}

export default {
  moveElementToNewPosition,
  addIds,
  removeIds,
  removeCell,
}
