const PLACEHOLDER_CLASS = '.Layout_Cell--placeholder'

const showElement = ($el) => {
  $el.style.display = 'block'
}

const moveCellToPlaceholderPosition = (cellId) => {
  const $placeholder = document.querySelector(PLACEHOLDER_CLASS)
  
  const $cell = document.getElementById(cellId)

  $placeholder.parentNode.insertBefore($cell, $placeholder.nextSibling)
}

const getParentId = (cellId) => {
  const $cell = document.getElementById(cellId)

  return $cell.parentElement.id
}

const getPrevSiblingId = (cellId) => {
  const $cell = document.getElementById(cellId)

  return $cell.previousElementSibling && $cell.previousSibling.id.slice(5)
}

export default {
  moveCellToPlaceholderPosition,
  showElement,
  getParentId,
  getPrevSiblingId,
}
