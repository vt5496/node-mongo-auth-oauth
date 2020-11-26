export default function homepage () {
  const email = localStorage.getItem('LOGIN')
  const root = document.getElementById('root')
  root.innerText = ''
  root.innerHTML = `
<h1>Hello ${email}! </h1>
`

}



