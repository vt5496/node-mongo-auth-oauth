export default function homepage () {
  const email = localStorage.getItem('LOGIN')
  const root = document.getElementById('root')
  root.innerText = ''
  root.innerHTML = `
<h1>Hello ${email}! </h1>
<a href="https://accounts.google.com/o/oauth2/v2/auth/oauthchooseaccount?response_type=code&redirect_uri=http://localhost:3002/oauth-redirect&client_id=484749255651-tpn526p3rihq8mi00ac77hbospa1uv32.apps.googleusercontent.com&access_type=offline&scope=email&flowName=GeneralOAuthFlow"> GOOGLE </a>
<a href='https://www.facebook.com/v9.0/dialog/oauth?client_id=3811130285572293&redirect_uri=http://localhost:3002/oauth-redirect&scope=email'>FACEBOOK</a>
`

}



