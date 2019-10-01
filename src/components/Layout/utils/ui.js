const PLACEHOLDER_CLASS = '.Layout_Cell--placeholder'

const showElement = ($el) => {
  $el.style.display = 'block'
}

const moveCellToPlaceholderPosition = (cellId) => {
  const $placeholder = document.querySelector(PLACEHOLDER_CLASS)
  
  const $cell = document.getElementById(cellId)

  $placeholder.parentNode.insertBefore($cell, $placeholder.nextSibling)
}

export default {
  moveCellToPlaceholderPosition,
}
