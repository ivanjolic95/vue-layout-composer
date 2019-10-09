const PLACEHOLDER_CLASS = '.Layout_Cell--placeholder'

const extractCellId = (htmlId) => htmlId && parseInt(htmlId.slice(5), 10)

const showElement = ($el) => {
  $el.style.display = 'block'
}

const resetLayoutsStyle = () => {
  document.querySelectorAll('.Layout').forEach(layoutEl => {
    layoutEl.style.paddingTop = '0px'
    layoutEl.style.paddingBottom = '0px'
    layoutEl.style.paddingLeft = '0px'
    layoutEl.style.paddingRight = '0px'
    layoutEl.style.backgroundColor = null
  })
}

const moveCellToPlaceholderPosition = (cellId) => {
  const $placeholder = document.querySelector(PLACEHOLDER_CLASS)

  if (!$placeholder) return
  
  const $cell = document.getElementById(cellId)

  $cell.style.marginTop = $placeholder.style.marginTop
  $cell.style.marginLeft = $placeholder.style.marginLeft

  resetLayoutsStyle()

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
  resetLayoutsStyle,
}
