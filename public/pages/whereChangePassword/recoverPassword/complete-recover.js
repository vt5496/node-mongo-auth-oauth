import setPassword from '../setPassword.js'
import createPageError404 from '../../error404.js'

export default async function createCompleteRecover () {
  const url = JSON.stringify({url: window.location.pathname})
  const fetchOptions = {
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    body: url
  }
  const res = await fetch('/api/complete-forgot-password', fetchOptions)
  const text = await res.text()
  if (res.status === 200){
    setPassword(text, 'recover')
  } else {
    createPageError404(text)
  }
}
