
export default function createInvite () {
  const root = document.getElementById('root')
  root.innerText = ''
  root.innerHTML = `
    <form class="col s12" action="/api/invite" id="formInvite">
      <label for="email">
        <strong>Email</strong>
        <input type="email" name="email" id="email">
      </label>
      <button type="submit" value="Invite" class="waves-effect waves-light btn-small">Send invite</button>
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
      const formData = new FormData(form)
      const plainFormData = Object.fromEntries(formData.entries())
      if (plainFormData.email.trim() === '') {
        result.innerText = ''
        return result.append('Your email is empty, try again')
      }
      const formDataJsonString = JSON.stringify(plainFormData)

      const fetchOptions = {
        method: 'post',
        headers: {
          'Content-Type': 'multipart/form-data',
          'X-Authorization': localStorage.getItem('TOKEN')
        },
        body: formDataJsonString
      }
      const res = await fetch(url, fetchOptions)
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

