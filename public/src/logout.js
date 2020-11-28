export default function logOut (){
  localStorage.removeItem('TOKEN')
  localStorage.removeItem('LOGIN')
  localStorage.removeItem('GOOGLE')
  localStorage.removeItem('FACEBOOK')
  const header = document.getElementById('header')
  header.style.display = 'none'
  window.history.pushState({}, '', `/login`)
}