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
