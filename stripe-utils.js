require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_TOKEN);
stripe.setApiVersion("2019-03-14");

const create_service_product = async (
  service_name,
  statement_descriptor = service_name
) => {
  return stripe.products.create({
    name: service_name,
    type: "service",
    statement_descriptor
  });
};

const create_monthly_plan = async (product_id, plan_name, yen) => {
  return stripe.plans.create({
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

  return stripe.customers.create({
    email,
    source: token
  });
};

const create_customer_without_card = async email => {
  return stripe.customers.create({
    email
  });
};

const create_subscription = async (customer_id, plan_id) => {
  return stripe.subscriptions.create({
    customer: customer_id,
    items: [{ plan: plan_id }],
    expand: ["latest_invoice.payment_intent"]
  });
};

const change_plan_of_subscription = async (subscription_id, new_plan_id) => {
  const subscription = await stripe.subscriptions.retrieve(subscription_id);
  return stripe.subscriptions.update(subscription.id, {
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

const cancel_subscription_immediately = async (subscription_id) => {
  return stripe.subscriptions.del(subscription_id);
};

const cancel_subscription_at_the_end_of_period = async (subscription_id) => {
  return stripe.subscriptions.update(subscription_id, {cancel_at_period_end: true});
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

const check_if_customer_has_card = async customer_id => {
  const customer = await stripe.customers.retrieve(customer_id);
  return customer["default_source"] !== null;
};

const check_if_subscription_valid = async subscription_id => {
  const subscription = await stripe.subscriptions.retrieve(subscription_id);
  return subscription["status"] === "active";
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
  cancel_subscription_immediately,
  cancel_subscription_at_the_end_of_period,
  create_webhook_endpoint_for_all_events,
  create_webhook_endpoints_for_subscription,
  check_if_customer_has_card,
  check_if_subscription_valid,
  get_stripe_stored_data
};
