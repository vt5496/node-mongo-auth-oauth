
export default function recoverPassword () {
  const root = document.getElementById('root')
  root.innerText = ''
  root.innerHTML = `
    <form class="col s12" action="/api/forgot-password" id="formInvite">
      <label for="email">
        <strong>Email</strong>
        <input type="email" name="email" id="email">
      </label>
      <button type="submit" value="Invite" class="waves-effect waves-light btn-small">Send message</button>
    </form>
    <div id="result"></div>`

  const email = document.getElementById('email')
  const formInvite = document.getElementById('formInvite')
  formInvite.addEventListener('submit', handleFormInviteSubmit)
  const result = document.getElementById('result')

  async function handleFormInviteSubmit (event) {
    event.preventDefault()
    const form = event.currentTarget
    const url = form.action

    try {

      //get form data
      const formData = new FormData(form)
      const plainFormData = Object.fromEntries(formData.entries())

      //check form data
      if (plainFormData.email.trim() === '') {
        result.innerText = ''
        return result.append('Your email is empty, try again')
      }

      //JSON stringify form data
      const formDataJsonString = JSON.stringify(plainFormData)

      //============== fetch ==============
      //set fetch options
      const fetchOptions = {
        method: 'post',
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        body: formDataJsonString
      }
      const res = await fetch(url, fetchOptions)

      //read response body
      const text = await res.text()
      result.innerText = text
      if (res.status === 200) {
        email.value = ''
      }
    } catch (error) {
      console.error(error)
    }
  }
}

