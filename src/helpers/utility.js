import { isString } from './validationHelper.js'

export const trimStringValues = (val) => {
  if (isString(val)) {
    return val.trim()
  }
}
