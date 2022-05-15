export default {
  USER_VALID_DATA: {
    username: 'c240c4061717ac1806ae6ee72be3533b',
    password: 20920
  },
  LOGIN_NO_USERNAME: {
    username: '',
    password: 20020
  },
  LOGIN_NO_PASSWORD: {
    username: 'c240c4061717ac1806ae6ee72be3533b',
    password: ''
  },
  LOGIN_INVALID_USERNAME: {
    username: 20,
    password: 129232
  },
  LOGIN_INVALID_PASSWORD: {
    username: 'c240c4061717ac1806ae6ee72be3533b',
    password: 'passwordshouldnotbetext'
  },
  LOGIN_INCORRECT_USERNAME: { // username doesn't match that of the entry being inserted into the database
    username: 'd540c2261743ac1803ae6eew2be3533b',
    password: 20920
  },
  LOGIN_INCORRECT_PASSWORD: { // password doesn't match the entry being inserted into the database
    username: 'd540c2261743ac1803ae6eew2be3533b',
    password: 50320
  }
}
