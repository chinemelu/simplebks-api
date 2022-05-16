import { ObjectId } from 'mongodb'

export const isInputEmpty = (val) => isUndefined(val) || isEmptyString(val)

export const isEmptyString = (val) => {
  return isString(val) && !val.length
}

export const isString = (val) => typeof val === 'string' || val instanceof String

export const isUndefined = (val) => {
  return typeof (val) === 'undefined'
}

export const isInteger = (val) => {
  return typeof val !== 'undefined' && (val === parseInt(val, 10))
}
export const isPositiveInteger = (val) => isInteger(val) && val > 0

export const objectIsEmpty = (val) => !Object.keys(val).length

export const isValidBase64 = (val) => {
  return /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/
    .test(val)
}

export const arePlainTextCredentialsTheRightPattern = (val) => {
  // should follow username:password pattern
  const regexForValidation = /^[0-9a-zA-Z]+:\d+$/
  return regexForValidation.test(val)
}

export const isValidObjectId = (value) => {
  return ObjectId.isValid(value)
}
