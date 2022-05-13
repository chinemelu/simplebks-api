import { trimStringValues } from '../helper/helper.js'

const trimValues = (req, res, next) => {
  const {
    Currency,
    CurrencyCountry,
    Customer,
    PaymentEntity
  } = req.body

  req.body.Currency = trimStringValues(Currency)
  req.body.CurrencyCountry = trimStringValues(CurrencyCountry)
  req.body.Customer.EmailAddress = trimStringValues(Customer.EmailAddress)
  req.body.Customer.FullName = trimStringValues(Customer.FullName)
  req.body.PaymentEntity.Issuer = trimStringValues(PaymentEntity.Issuer)
  req.body.PaymentEntity.Number = trimStringValues(PaymentEntity.Number)

  if (PaymentEntity.Brand) {
    // Brand is the only optional string here
    // This will prevent it from erroring out due to the trim method
    req.body.PaymentEntity.Brand = trimStringValues(PaymentEntity.Brand)
  }
  req.body.PaymentEntity.Type = trimStringValues(PaymentEntity.Type)
  req.body.PaymentEntity.Country = trimStringValues(PaymentEntity.Country)

  next()
}

export default trimValues
