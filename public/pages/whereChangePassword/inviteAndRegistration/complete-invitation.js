import setPassword from '../setPassword.js'
import createPageError404 from '../../error404.js'

export default async function completeInvitation(){

  const url = JSON.stringify({url: window.location.pathname})
  const fetchOptions = {
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    body: url
  }
  const res = await fetch('/api/complete-invitation', fetchOptions)
  const text = await res.text()
  if (res.status === 200){
    setPassword(text, 'invite')
  } else {
    createPageError404(text)
  }
}