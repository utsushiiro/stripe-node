require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_TOKEN);
stripe.setApiVersion("2019-03-14");

const create_service_product = async (
  service_name,
  statement_descriptor = service_name
) => {
  return await stripe.products.create({
    name: service_name,
    type: "service",
    statement_descriptor
  });
};

const create_monthly_plan = async (product_id, plan_name, yen) => {
  return await stripe.plans.create({
    product: product_id,
    nickname: plan_name,
    currency: "jpy",
    interval: "month",
    amount: yen
  });
};

const create_customer_with_dummy_card = async (
  email,
  is_charge_failed_card = false
) => {
  let token;
  if (is_charge_failed_card) {
    // https://stripe.com/docs/testing#cards-responses
    token = "tok_chargeCustomerFail";
  } else {
    // https://stripe.com/docs/testing#cards
    token = "tok_visa";
  }

  return await stripe.customers.create({
    email,
    source: token
  });
};

const create_customer_without_card = async email => {
  return await stripe.customers.create({
    email
  });
};

const create_subscription = async (customer_id, plan_id) => {
  return await stripe.subscriptions.create({
    customer: customer_id,
    items: [{ plan: plan_id }],
    expand: ["latest_invoice.payment_intent"]
  });
};

const change_plan_of_subscription = async (subscription_id, new_plan_id) => {
  const subscription = await stripe.subscriptions.retrieve(subscription_id);
  return await stripe.subscriptions.update(subscription.id, {
    cancel_at_period_end: false,
    items: [
      {
        /*
         * This id specification is necessary to replace previous plan
         * If it is removed, this subscription will have two plans by this update.
         */
        id: subscription.items.data[0].id,
        plan: new_plan_id
      }
    ],
    expand: ["latest_invoice.payment_intent"]
  });
};

const create_webhook_endpoint_for_all_events = async webhook_url => {
  return stripe.webhookEndpoints.create({
    url: webhook_url,
    enabled_events: ["*"]
  });
};

const create_webhook_endpoints_for_subscription = async webhook_url => {
  return stripe.webhookEndpoints.create({
    url: webhook_url,
    enabled_events: ["*"]
  });
};

const get_stripe_stored_data = () => {
  return require("./stripe-data.json");
};

module.exports = {
  create_service_product,
  create_monthly_plan,
  create_customer_with_dummy_card,
  create_customer_without_card,
  create_subscription,
  change_plan_of_subscription,
  create_webhook_endpoint_for_all_events,
  create_webhook_endpoints_for_subscription,
  get_stripe_stored_data
};
