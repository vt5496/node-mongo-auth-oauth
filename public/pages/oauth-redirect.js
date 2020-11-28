export default function createOAuthRedirect () {
  const urlParams = new URLSearchParams(window.location.search)
  const formDataJsonString = JSON.stringify(urlParams.get('code'))
  const token = localStorage.getItem('TOKEN')
  const header = document.getElementById('header')

  if (token) {
    registration()
  } else {
    login()
  }

  function registration () {
    const options = {
      method: 'post',
      headers: {
        'x-authorization': token,
      },
      body: formDataJsonString,
    }
    if (window.location.search.includes('google')) {
      const url = 'http://localhost:3002/oauth-redirect/google';
      (async function () {
        const res = await fetch(url, options)
        const json = await res.json()
        setLS(json)
        header.style.display = 'block'
        changeURL(`/home`)
      })()
    } else {
      const url = 'http://localhost:3002/oauth-redirect/facebook';
      (async function () {
        const res = await fetch(url, options)
        const json = await res.json()
        setLS(json)
        header.style.display = 'block'
        changeURL(`/home`)
      })()
    }
  }

  function login () {
    const options = {
      method: 'post',
      body: formDataJsonString,
    }
    if (window.location.search.includes('google')) {
      const url = 'http://localhost:3002/oauth-redirect-login/google';
      (async function () {
        const res = await fetch(url, options)
        const json = await res.json()
        if (res.status === 403) {
          return pushState(`/login`)
        }
        setLS(json)
        header.style.display = 'block'
        changeURL(`/home`)
      })()
    } else {
      const url = 'http://localhost:3002/oauth-redirect-login/facebook';
      (async function () {
        const res = await fetch(url, options)
        const json = await res.json()
        if (res.status === 403) {
          return pushState(`/login`)
        }
        setLS(json)
        header.style.display = 'block'
        changeURL(`/home`)
      })()
    }
  }

  function setLS (json) {
    localStorage.setItem('TOKEN', json.token)
    localStorage.setItem('LOGIN', json.email)
    localStorage.setItem('FACEBOOK', json.facebook)
    localStorage.setItem('GOOGLE', json.google)
  }

  function changeURL (url) {
    window.history.pushState({}, '', url)
  }
}
