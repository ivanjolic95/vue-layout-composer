const PLACEHOLDER_CLASS = '.Layout_Cell--placeholder'

const extractCellId = (htmlId) => htmlId && parseInt(htmlId.slice(5), 10)

const showElement = ($el) => {
  $el.style.display = 'block'
}

const moveCellToPlaceholderPosition = (cellId) => {
  const $placeholder = document.querySelector(PLACEHOLDER_CLASS)

  if (!$placeholder) return
  
  const $cell = document.getElementById(cellId)

  $placeholder.parentNode.insertBefore($cell, $placeholder.nextSibling)
}

const getParentId = (cellId) => {
  const $cell = document.getElementById(cellId)

  return parseInt($cell.parentElement.id, 10)
}

const getPrevSiblingId = (cellId) => {
  const $cell = document.getElementById(cellId)

  return $cell.previousElementSibling && parseInt($cell.previousSibling.id.slice(5), 10)
}

export default {
  extractCellId,
  moveCellToPlaceholderPosition,
  showElement,
  getParentId,
  getPrevSiblingId,
}
