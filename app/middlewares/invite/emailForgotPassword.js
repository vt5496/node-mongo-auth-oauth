const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
async function emailSenderRecover (emailAddress, text) {
  const msg = {
    to: emailAddress, // Change to your recipient
    from: 'tkk.vladd@gmail.com', // Change to your verified sender
    subject: 'Study boards',
    text: `Welcome to Study boards!
    Your invite: http://localhost:3001/complete-recover/${text}`,
    html: `<h1>Welcome to Study boards!</h1>
Your invite: <strong>http://localhost:3002/complete-recover/${text}</strong>`,
  }
  await sgMail
    .send(msg)
    .then(() => {
      console.log('Email send')
    })
    .catch((error) => {
      console.error(error)
    })
}


module.exports = emailSenderRecover