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
   <a id="googlebtn">Google</a>
   <fb:login-button scope="public_profile,email" onlogin="checkLoginState();">
</fb:login-button>
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

  document.getElementById('googlebtn').addEventListener('click', oauth2SignIn)

  //===================== GOOGLE OAuth ==========================

  const YOUR_CLIENT_ID = '484749255651-tpn526p3rihq8mi00ac77hbospa1uv32.apps.googleusercontent.com';
  const YOUR_REDIRECT_URI = 'http://localhost:3002/login';
  const fragmentString = location.hash.substring(1);

  // Parse query string to see if page request is coming from OAuth 2.0 server.
  const params = {};
  let regex = /([^&=]+)=([^&]*)/g, m;
  while (m = regex.exec(fragmentString)) {
    params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
  }
  if (Object.keys(params).length > 0) {
    localStorage.setItem('oauth2-google', JSON.stringify(params) );
    if (params['state'] && params['state'] === 'try_sample_request') {
      trySampleRequest();
    }
  }

  // If there's an access token, try an API request.
  // Otherwise, start OAuth 2.0 flow.
  function trySampleRequest() {
    const params = JSON.parse(localStorage.getItem('oauth2-google'));
    if (params && params['access_token']) {
      const xhr = new XMLHttpRequest();
      xhr.open('GET',
        'https://www.googleapis.com/oauth2/v1/userinfo?alt=json&' +
        'access_token=' + params['access_token']);
      xhr.onreadystatechange = function (e) {
        if (xhr.readyState === 4 && xhr.status === 200) {
          const resObj = JSON.parse(xhr.response)
          if(resObj.email) {
            console.log(resObj.email)
            oAuthGoogleServer(xhr.response)
          }
        } else if (xhr.readyState === 4 && xhr.status === 401) {
          // Token invalid, so prompt for user permission.
          oauth2SignIn();
        }
      };
      xhr.send(null);
    } else {
      oauth2SignIn();
    }
  }

  /*
   * Create form to request access token from Google's OAuth 2.0 server.
   */
  function oauth2SignIn() {
    // Google's OAuth 2.0 endpoint for requesting an access token
    const oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';

    // Create element to open OAuth 2.0 endpoint in new window.
    const form = document.createElement('form');
    form.setAttribute('method', 'GET'); // Send as a GET request.
    form.setAttribute('action', oauth2Endpoint);

    // Parameters to pass to OAuth 2.0 endpoint.
    const params = {'client_id': YOUR_CLIENT_ID,
      'redirect_uri': YOUR_REDIRECT_URI,
      'scope': 'email',
      'state': 'try_sample_request',
      'include_granted_scopes': 'true',
      'response_type': 'token'};

    // Add form parameters as hidden input values.
    for (let p in params) {
      const input = document.createElement('input');
      input.setAttribute('type', 'hidden');
      input.setAttribute('name', p);
      input.setAttribute('value', params[p]);
      form.appendChild(input);
    }

    // Add form to page and submit it to open the OAuth 2.0 endpoint.
    document.body.appendChild(form);
    form.submit();
  }

  async function oAuthGoogleServer(obj){
    const res = await fetch('/oauth-redirect/google',
      {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(obj)
      })
    const json = await res.json()
    if (res.status === 200) {
      const header = document.getElementById('header')
      header.style.display = 'block'
      localStorage.setItem('TOKEN', json.token)
      localStorage.setItem('LOGIN', json.email)
      window.history.pushState({}, '', `/home`)
    } else {
      localStorage.removeItem('oauth2-google')
      document.getElementById('result').innerText = `Request status is: ${res.status}. Message: ${json}`
    }
  }



  //================================================ FACEBOOK ==============


  function statusChangeCallback(response) {  // Called with the results from FB.getLoginStatus().
    console.log('statusChangeCallback');
    console.log(response);                   // The current login status of the person.
    if (response.status === 'connected') {   // Logged into your webpage and Facebook.
      testAPI();
    } else {                                 // Not logged into your webpage or we are unable to tell.
      document.getElementById('status').innerHTML = 'Please log ' +
        'into this webpage.';
    }
  }


  function checkLoginState() {               // Called when a person is finished with the Login Button.
    FB.getLoginStatus(function(response) {   // See the onlogin handler
      statusChangeCallback(response);
    });
  }


  window.fbAsyncInit = function() {
    FB.init({
      appId      : '3811130285572293',
      cookie     : true,                     // Enable cookies to allow the server to access the session.
      xfbml      : true,                     // Parse social plugins on this webpage.
      version    : 'v9.0'           // Use this Graph API version for this call.
    });


    FB.getLoginStatus(function(response) {   // Called after the JS SDK has been initialized.
      statusChangeCallback(response);        // Returns the login status.
    });
  };

  function testAPI() {                      // Testing Graph API after login.  See statusChangeCallback() for when this call is made.
    console.log('Welcome!  Fetching your information.... ');
    FB.api('/me', function(response) {
      console.log('Successful login for: ' + response.name);
      document.getElementById('status').innerHTML =
        'Thanks for logging in, ' + response.name + '!';
    });
  }
}



