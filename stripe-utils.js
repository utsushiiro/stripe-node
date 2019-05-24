require('dotenv').config();
const stripe = require("stripe")(process.env.STRIPE_TOKEN);

const create_service_product = async (service_name, statement_descriptor = service_name) => {
  return await stripe.products.create({
    name: service_name,
    type: 'service',
    statement_descriptor
  })
};

const create_monthly_plan = async (productId, planName, yen) => {
  return await stripe.plans.create({
    product: productId,
    nickname: planName,
    currency: 'jpy',
    interval: 'month',
    amount: yen,
  })
};

const create_customer_with_dummy_card = async (email) => {
  return await stripe.customers.create({
    email,
    source: 'tok_visa', // see tokens table of https://stripe.com/docs/testing#cards
  });
};

const create_customer_without_card = async (email) => {
  return await stripe.customers.create({
    email
  });
};

const create_subscription = async (customerId, planId) => {
  return  await stripe.subscriptions.create({
    customer: customerId,
    items: [{plan: planId}],
  });
};

module.exports = {
  create_service_product,
  create_monthly_plan,
  create_customer_with_dummy_card,
  create_customer_without_card,
  create_subscription
};
