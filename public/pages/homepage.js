export default function homepage () {
  const email = localStorage.getItem('LOGIN')
  const root = document.getElementById('root')
  root.innerText = ''
  root.innerHTML = `
<h1>Hello ${email}! </h1>
<div style="display: flex; flex-direction: row; ">
<div style="padding: 10px">
<a id="GOOGLE" class="waves-effect waves-light btn-small" href="https://accounts.google.com/o/oauth2/v2/auth/oauthchooseaccount?response_type=code&redirect_uri=http://localhost:3002/oauth-redirect&client_id=484749255651-tpn526p3rihq8mi00ac77hbospa1uv32.apps.googleusercontent.com&access_type=offline&scope=email&flowName=GeneralOAuthFlow"> GOOGLE </a>
</div>
<div style="padding: 10px">
<a id="FACEBOOK" class="waves-effect waves-light btn-small" href='https://www.facebook.com/v9.0/dialog/oauth?client_id=3811130285572293&redirect_uri=http://localhost:3002/oauth-redirect&scope=email'>FACEBOOK</a>
</div>
</div>
`
  function hide () {
    const googleToken = localStorage.getItem('GOOGLE')
    const facebookToken = localStorage.getItem('FACEBOOK')
    console.log(googleToken !== undefined, facebookToken !== undefined)
    if (googleToken !== 'undefined') {
      document.getElementById('GOOGLE').style.display = 'none'
    }
    if (facebookToken !== 'undefined') {
      document.getElementById('FACEBOOK').style.display = 'none'
    }
  }
  hide()
}



