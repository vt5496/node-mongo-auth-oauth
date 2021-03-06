import recoverPassword from './whereChangePassword/recoverPassword/recover-password.js'

export default function createLoginForm () {
  const root = document.getElementById('root')
  root.innerText = ''

  root.innerHTML = `
  <form class="form" action="/api/login" id="formLogin">
    <label for="email">
        <strong>Email</strong>
        <input type="email" name="email" id="email">
    </label>

    <label for="password">
        <strong>Password</strong>
        <input type="password" name="password" id="password">
    </label>
    <button type="submit"  class="waves-effect waves-light btn-small">Login</button>
   <button id="forgotPassword" class="waves-effect waves-light btn-small">Forgot password</button>
</div>
  </form>
  <div id="result"></div>`

  const email = document.getElementById('email')
  const password = document.getElementById('password')
  const result = document.getElementById('result')

  const forgotPassword = document.getElementById('forgotPassword')
  forgotPassword.addEventListener('click', fetchForgotPassword)

  const formLogin = document.getElementById('formLogin')
  formLogin.addEventListener('submit', handleFormSubmit)

  async function handleFormSubmit (event) {
    event.preventDefault()
    const form = event.currentTarget
    const url = form.action

    try {
      const formData = new FormData(form)
      const plainFormData = Object.fromEntries(formData.entries())

      if (email.value.trim() === '' || password.value.trim() === '') {
        throw new Error('Email and password can`t be empty!!')
      }
      const formDataJsonString = JSON.stringify(plainFormData)

      const fetchOptions = {
        method: 'post',
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        body: formDataJsonString
      }
      const res = await fetch(url, fetchOptions)
      const json = await res.json()


      if (res.status === 200) {
        const header = document.getElementById('header')
        header.style.display = 'block'
        localStorage.setItem('TOKEN', json.token)
        localStorage.setItem('LOGIN', json.email)
        window.history.pushState({}, '', `/home`)
      } else {
        result.innerText = `Request status is: ${res.status}. Message: ${json}`
      }

    } catch (error) {
      result.innerText = error.message
    }
  }
  function fetchForgotPassword () {
    recoverPassword()
  }
 }



