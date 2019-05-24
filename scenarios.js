const stripe_utils = require('./stripe-utils');

/*
 * TODO
 *  - Plan change scenario
 *    - upgrade case
 *    - downgrade case (paid to paid)
 *    - downgrade case (paid to free)
 *  - Plan cancel scenario
 *  ...etc
 */

const success_scenario_for_paid_plan = async () => {
    try {
        const product = await stripe_utils.create_service_product('Good SaaS Service');
        const plan = await stripe_utils.create_monthly_plan(product.id, 'Good SaaS Monthly Plan', 100);
        const customer = await stripe_utils.create_customer_with_dummy_card('utsushiiro-with-card@example.com');
        const subscription = await stripe_utils.create_subscription(customer.id, plan.id);
        console.log({product, plan, customer, subscription});
    } catch (err) {
        console.log(err);
    }
};

const fail_scenario_for_paid_plan = async () => {
    try {
        const product = await stripe_utils.create_service_product('Good SaaS Service');
        const plan = await stripe_utils.create_monthly_plan(product.id, 'Good SaaS Monthly Plan', 100);
        const customer = await stripe_utils.create_customer_without_card('utsushiiro-without-card@example.com');
        const subscription = await stripe_utils.create_subscription(customer.id, plan.id);
        console.log({product, plan, customer, subscription});
    } catch (err) {
        console.log(err);
    }
};

const success_scenario_for_free_plan = async () => {
    try {
        const product = await stripe_utils.create_service_product('Good SaaS Service');
        const plan = await stripe_utils.create_monthly_plan(product.id, 'Good SaaS Monthly Plan', 0);
        const customer = await stripe_utils.create_customer_without_card('utsushiiro-without-card@example.com');
        const subscription = await stripe_utils.create_subscription(customer.id, plan.id);
        console.log({product, plan, customer, subscription});
    } catch (err) {
        console.log(err);
    }
};

