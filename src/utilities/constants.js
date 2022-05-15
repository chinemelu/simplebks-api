export const RESPONSE_MESSAGE = {
  SERVER_ERROR: 'Server error. Please try again',
  INVALID_CREDENTIALS: 'Invalid credentials',
  MISSING_AUTHORIZATION_HEADER: 'Missing authorization header',
  INVALID_QUERY_LIMIT: 'Invalid query limit. limit is between 20 and 100',
  INVALID_ORDER_QUERY_STRING: 'Invalid order query string. Order should be either asc or desc',
  INVALID_SORT_QUERY_STRING: 'Invalid sort query string. You can only sort by shipping_limit_date or price',
  INVALID_ORDER_ITEM_ID: 'Invalid order Id. Id must be an integer',
  ORDER_ITEM_NOT_FOUND: 'This order does not exist',
  ORDER_ITEM_DELETED: 'Item deleted successfully'
}

export const CONFIG = {
  DB: 'simplebks-api',
  ORDER_SELLERS: 'orderSellers',
  ORDER_ITEMS: 'orderItems'
}

export const ORDER = {
  ASC: 'asc',
  DESC: 'desc'
}

export const ERROR = {
  NOT_FOUND: 'NotFoundError',
  VALIDATION_ERROR: 'ValidationError'
}

export const SORT = {
  SHIPPING_LIMIT_DATE: 'shipping_limit_date',
  PRICE: 'price'
}

export const STATUS_CODE = {
  CREATED: 201,
  OK: 200,
  NOT_FOUND: 404,
  USER_ERROR: 400,
  SERVER_ERROR: 500,
  AUTH_ERROR: 401,
  FORBIDDEN_ERROR: 403
}
