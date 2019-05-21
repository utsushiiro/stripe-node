const stripe = require("stripe")(process.env.STRIPE_TOKEN);


const create_product = async () => {
  return await stripe.products.create({
    name: 'SaaS Platform',
    type: 'service',
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

const create_customer = async () => {
  return await stripe.customers.create({
    email: 'utsushiiro@example.com',
    source: 'src_18eYalAHEMiOZZp1l9ZTjSU0', // from sample code
  });
};


const set_subscription = async (customerId, planId, start_timestamp) => {
  return  await stripe.subscriptions.create({
    customer: customerId,
    items: [{plan: planId}],

  });
};

