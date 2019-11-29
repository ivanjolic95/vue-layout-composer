/* eslint-disable no-param-reassign */
const PLACEHOLDER_CLASS = '.Layout_Cell--placeholder'

const extractCellId = htmlId => htmlId && parseInt(htmlId.slice(5), 10)

const showElement = $el => {
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

const moveCellToPlaceholderPosition = (
  cellId,
  newRoot = document,
  prevRoot = document
) => {
  const $placeholders = [...newRoot.querySelectorAll(PLACEHOLDER_CLASS)]
  const $otherPlaceholders = $placeholders.slice(1)

  if (!$placeholders.length) return

  const $placeholder = $placeholders[0]

  $otherPlaceholders.forEach($otherPlaceholder => $otherPlaceholder.remove())

  const $cell = prevRoot.querySelector(`[id='${cellId}']`)

  if (!$cell) return

  $cell.style.marginTop = $placeholder.style.marginTop
  $cell.style.marginLeft = $placeholder.style.marginLeft

  resetLayoutsStyle()

  $placeholder.parentNode.insertBefore($cell, $placeholder.nextSibling)
}

const getParentId = $cell => {
  return extractCellId($cell.parentElement.parentElement.id)
}

const getPrevSiblingId = $cell => {
  return (
    $cell.previousSibling.previousSibling &&
    extractCellId($cell.previousSibling.previousSibling.id)
  )
}

export default {
  extractCellId,
  moveCellToPlaceholderPosition,
  showElement,
  getParentId,
  getPrevSiblingId,
  resetLayoutsStyle,
}
