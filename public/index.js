import pageLocation from './logic.js'

//create and add event for listening window.history
const _wr = function (type) {
  const orig = history[type]
  return function () {
    const rv = orig.apply(this, arguments)
    const e = new Event(type)
    e.arguments = arguments
    window.dispatchEvent(e)
    return rv
  }
}
history.pushState = _wr('pushState')
window.addEventListener('pushState', pageLocation)

//create page logic with window location
pageLocation()

//get header for hide or show
const header = document.getElementById('header')

//function for check actual token
function checkToken(){
  return localStorage.getItem('TOKEN')
}

//when page load
if (checkToken()) {
  header.style.display = 'block'
  window.history.pushState({}, '', `/home`)
} else {
  header.style.display = 'none'
  window.history.pushState({}, '', `/login`)
}

//when click button check token and show or hide header navigation
const buttons = document.querySelectorAll('a')
buttons.forEach((button) => {
  button.addEventListener('click', () => {
    (function(){
      if (checkToken()) {
        header.style.display = 'block'
        window.history.pushState({}, '', `/${button.id}`)
      } else {
        header.style.display = 'none'
        window.history.pushState({}, '', `/login`)
      }
    })()
  })
})