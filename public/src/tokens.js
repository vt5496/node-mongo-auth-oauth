const verifyToken = (token) => {
  try {
    atob(token)
  } catch (e) {
    console.log(e);
  }
};

export default verifyToken(token)

console.log(signAccessToken({user: {id: 1, email: 'tkk.vlad'}}))

