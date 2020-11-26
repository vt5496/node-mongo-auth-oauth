export default function createPageError404 (msg){
  const header = document.getElementById('header')
  const root = document.getElementById('root')

  header.style.display = 'none'
  root.innerHTML = `
  <h1>Error 404</h1>
   <h2>${msg}</h2>
  `
}