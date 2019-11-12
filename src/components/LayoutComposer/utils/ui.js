const PLACEHOLDER_CLASS = '.Layout_Cell--placeholder'

const extractCellId = (htmlId) => htmlId && parseInt(htmlId, 10)

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

const moveCellToPlaceholderPosition = (cellId, newRoot = document, prevRoot = document) => {
  const $placeholder = newRoot.querySelector(PLACEHOLDER_CLASS)

  if (!$placeholder) return
  
  const $cell = prevRoot.querySelector(`[id='${cellId}']`)

  $cell.style.marginTop = $placeholder.style.marginTop
  $cell.style.marginLeft = $placeholder.style.marginLeft

  resetLayoutsStyle()

  $placeholder.parentNode.insertBefore($cell, $placeholder.nextSibling)
}

const getParentId = ($cell) => {
  return parseInt($cell.parentElement.parentElement.id, 10)
}

const getPrevSiblingId = ($cell) => {
  return $cell.previousSibling.previousSibling && parseInt($cell.previousSibling.previousSibling.id, 10)
}

export default {
  extractCellId,
  moveCellToPlaceholderPosition,
  showElement,
  getParentId,
  getPrevSiblingId,
  resetLayoutsStyle,
}
