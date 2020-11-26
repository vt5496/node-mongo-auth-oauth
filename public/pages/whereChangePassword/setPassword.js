export default function createPasswordForm (uuid, method) {
  const root = document.getElementById('root')
  root.innerText = ''

  root.innerHTML = `
  <h1>Set your password</h1>
  <form class="form" action="/api/complete-recover" id="formSetPassword">
    <label for="password">
        <strong>Password</strong>
        <input type="password" name="password" id="password">
    </label>
    <button type="submit" class="waves-effect waves-light btn-small">Login</button>
  </form>
  <div id="result"></div>`

  const password = document.getElementById('password')
  const result = document.getElementById('result')


  const formSetPassword = document.getElementById('formSetPassword')
  formSetPassword.addEventListener('submit', handleFormSubmit)

  async function handleFormSubmit (event) {
    event.preventDefault()
    const form = event.currentTarget
    const url = form.action

    try {
      //create and check form data
      const formData = new FormData(form)
      const plainFormData = Object.fromEntries(formData.entries())
      if (plainFormData.password.includes(' ') || 4 > plainFormData.password) {
        return result.innerText = 'Your password will be more 4 characters, and without " ".'
      }
      plainFormData.uuid = uuid
      plainFormData.method = method
      const formDataJsonString = JSON.stringify(plainFormData)
      //fetch options
      const fetchOptions = {
        method: 'post',
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        body: formDataJsonString
      }

      //create and wait fetch
      const res = await fetch(url, fetchOptions)

      //check response
      if (res.status === 200) {
        password.value = ''
        window.history.pushState({}, '', `/login`)
      } else {
        return result.innerText = `Error. Code ${res.status}.`
      }
    } catch (error) {
      console.error(error)
    }
  }
}