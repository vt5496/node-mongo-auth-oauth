import createLoginForm from './pages/login.js'
import createCompleteRecover from './pages/whereChangePassword/recoverPassword/complete-recover.js'
import createOAuthRedirect from './pages/oauth-redirect.js'
import createInvite from './pages/whereChangePassword/inviteAndRegistration/invite.js'
import homepage from './pages/homepage.js'
import completeInvitation from './pages/whereChangePassword/inviteAndRegistration/complete-invitation.js'
import logOut from './src/logout.js'

export default function pageLocation () {
  switch (window.location.pathname) {
    case '/login':
      createLoginForm()
      break
    case '/oauth-redirect':
      createOAuthRedirect()
      break
    case '/invite':
      createInvite()
      break
    case '/logout':
      logOut()
      break
    default:
      if (window.location.pathname.includes('/complete-invitation/')){
        completeInvitation()
      } else if (window.location.pathname.includes('/complete-recover/')) {
        createCompleteRecover()
      } else {
        homepage()
      }
      break
  }
}