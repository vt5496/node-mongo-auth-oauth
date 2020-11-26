export default function createOAuthRedirect () {
  const urlParams = new URLSearchParams(window.location.search)
  const formDataJsonString = JSON.stringify(urlParams.get('code'))
  const options = {
    method: 'post',
    headers: {
      'x-authorization': localStorage.getItem('TOKEN'),
    },
    body: formDataJsonString,
  }
  if (window.location.search.includes('google')) {
    const url = 'http://localhost:3002/oauth-redirect/google';
    (async function () {
      const res = await fetch(url, options)
      const json = await res.json()
      localStorage.setItem('TOKEN', json.token)
      localStorage.setItem('LOGIN', json.email)
      window.history.pushState({}, '', `/home`)
    })()
  } else {
    const url = 'http://localhost:3002/oauth-redirect/facebook';
    (async function () {
      const res = await fetch(url, options)
      const json = await res.json()
      localStorage.setItem('TOKEN', json.token)
      localStorage.setItem('LOGIN', json.email)
      window.history.pushState({}, '', `/home`)
    })()
  }
}
