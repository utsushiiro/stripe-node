const stripe_utils = require("./stripe-utils");

/*
 * TODO
 *  - Plan change scenario
 *    - upgrade case
 *    - downgrade case (paid to paid)
 *    - downgrade case (paid to free)
 *  - Plan cancel scenario
 *  ...etc
 *
 * TODO
 *  - use already created product, plan, customer...
 */

const success_scenario_for_paid_plan = async () => {
  try {
    const product = await stripe_utils.create_service_product(
      "Good SaaS Service"
    );
    const plan = await stripe_utils.create_monthly_plan(
      product.id,
      "Good SaaS Monthly Plan",
      100
    );
    const customer = await stripe_utils.create_customer_with_dummy_card(
      "utsushiiro-with-card@example.com"
    );
    const subscription = await stripe_utils.create_subscription(
      customer.id,
      plan.id
    );
    console.dir({ product, plan, customer, subscription }, { depth: 3 });
  } catch (err) {
    console.log(err);
  }
};

const fail_scenario_for_paid_plan_because_of_no_card = async () => {
  try {
    const product = await stripe_utils.create_service_product(
      "Good SaaS Service"
    );
    const plan = await stripe_utils.create_monthly_plan(
      product.id,
      "Good SaaS Monthly Plan",
      100
    );
    const customer = await stripe_utils.create_customer_without_card(
      "utsushiiro-without-card@example.com"
    );
    const subscription = await stripe_utils.create_subscription(
      customer.id,
      plan.id
    );
    console.dir({ product, plan, customer, subscription }, { depth: 3 });
  } catch (err) {
    console.log(err);
  }
};

const fail_scenario_for_paid_plan_because_of_card_declined = async () => {
  try {
    const product = await stripe_utils.create_service_product(
      "Good SaaS Service"
    );
    const plan = await stripe_utils.create_monthly_plan(
      product.id,
      "Good SaaS Monthly Plan",
      100
    );
    const customer = await stripe_utils.create_customer_with_dummy_card(
      "utsushiiro-with-declined-card@example.com",
      true
    );
    const subscription = await stripe_utils.create_subscription(
      customer.id,
      plan.id
    );
    console.dir({ product, plan, customer, subscription }, { depth: 3 });
  } catch (err) {
    console.log(err);
  }
};

const success_scenario_for_free_plan = async () => {
  try {
    const product = await stripe_utils.create_service_product(
      "Good SaaS Service"
    );
    const plan = await stripe_utils.create_monthly_plan(
      product.id,
      "Good SaaS Monthly Plan",
      0
    );
    const customer = await stripe_utils.create_customer_without_card(
      "utsushiiro-without-card@example.com"
    );
    const subscription = await stripe_utils.create_subscription(
      customer.id,
      plan.id
    );
    console.dir({ product, plan, customer, subscription }, { depth: 3 });
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  success_scenario_for_paid_plan,
  fail_scenario_for_paid_plan_because_of_no_card,
  fail_scenario_for_paid_plan_because_of_card_declined,
  success_scenario_for_free_plan
};
