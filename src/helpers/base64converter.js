const credentialsToBase64Converter = ({ username, password }) => {
  return Buffer.from(`${username}:${password}`).toString('base64')
}

export default credentialsToBase64Converter
