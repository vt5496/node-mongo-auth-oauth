export default function logOut (){
  localStorage.removeItem('TOKEN')
  localStorage.removeItem('LOGIN')
  localStorage.removeItem('oauth2-google')
  const header = document.getElementById('header')
  header.style.display = 'none'
  window.history.pushState({}, '', `/login`)
}