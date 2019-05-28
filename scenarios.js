const stripe_utils = require("./stripe-utils");
const stripe_data = stripe_utils.get_stripe_stored_data();

/*
 * TODO
 *  - Plan cancel scenario
 *  ...etc
 *
 * TODO
 *  - use already created product, plan, customer...
 */

const success_scenario_for_paid_plan = async () => {
  try {
    const subscription = await stripe_utils.create_subscription(
      stripe_data["customer_id_with_valid_dummy_card"],
      stripe_data["1000yen_monthly_plan_id"]
    );
    console.group("success_scenario_for_paid_plan");
    console.dir({ subscription }, { depth: 3 });
    console.groupEnd();
  } catch (err) {
    console.log(err);
  }
};

const fail_scenario_for_paid_plan_because_of_no_card = async () => {
  try {
    const subscription = await stripe_utils.create_subscription(
      stripe_data["customer_id_without_card"],
      stripe_data["1000yen_monthly_plan_id"]
    );
  } catch (err) {
    console.group("fail_scenario_for_paid_plan_because_of_no_card");
    console.log(err);
    console.groupEnd();
  }
};

const fail_scenario_for_paid_plan_because_of_card_declined = async () => {
  try {
    const subscription = await stripe_utils.create_subscription(
      stripe_data["customer_id_with_invalid_dummy_card"],
      stripe_data["1000yen_monthly_plan_id"]
    );
    console.group("fail_scenario_for_paid_plan_because_of_card_declined");
    console.dir({ subscription }, { depth: 3 });
    console.groupEnd();
  } catch (err) {
    console.log(err);
  }
};

const success_scenario_for_free_plan_and_customer_without_card = async () => {
  try {
    const subscription = await stripe_utils.create_subscription(
      stripe_data["customer_id_without_card"],
      stripe_data["free_monthly_plan_id"]
    );
    console.group("success_scenario_for_free_plan_and_customer_without_card");
    console.dir({ subscription }, { depth: 3 });
    console.groupEnd();
  } catch (err) {
    console.log(err);
  }
};

const upgrade_subscription_from_paid_plan = async () => {
  try {
    console.group("upgrade_subscription_from_paid_plan");
    const subscription = await stripe_utils.create_subscription(
        stripe_data["customer_id_with_valid_dummy_card"],
        stripe_data["1000yen_monthly_plan_id"]
    );
    console.dir({ subscription }, { depth: 4 });

    const updated_subscription = await stripe_utils.change_plan_of_subscription(
        subscription.id,
        stripe_data["3000yen_monthly_plan_id"]
    );
    console.dir({ updated_subscription }, { depth: 4 });

    console.groupEnd();
  } catch (err) {
    console.log(err);
  }
};

const upgrade_subscription_from_free_plan = async () => {
  console.group("upgrade_subscription_from_free_plan");
  const subscription = await stripe_utils.create_subscription(
      stripe_data["customer_id_with_valid_dummy_card"],
      stripe_data["free_monthly_plan_id"]
  );
  console.dir({ subscription }, { depth: 4 });

  const updated_subscription = await stripe_utils.change_plan_of_subscription(
      subscription.id,
      stripe_data["1000yen_monthly_plan_id"]
  );
  console.dir({ updated_subscription }, { depth: 4 });

  console.groupEnd();
};

const downgrade_subscription_to_paid_plan = async () => {
  try {
    console.group("downgrade_subscription_to_paid_plan");
    const subscription = await stripe_utils.create_subscription(
        stripe_data["customer_id_with_valid_dummy_card"],
        stripe_data["3000yen_monthly_plan_id"]
    );
    console.dir({subscription}, {depth: 4});

    const updated_subscription = await stripe_utils.change_plan_of_subscription(
        subscription.id,
        stripe_data["1000yen_monthly_plan_id"]
    );
    console.dir({updated_subscription}, {depth: 4});

    console.groupEnd();
  } catch (err) {
    console.log(err);
  }
};

const downgrade_subscription_to_free_plan = async () => {
  try {
    console.group("downgrade_subscription_to_paid_plan");
    const subscription = await stripe_utils.create_subscription(
        stripe_data["customer_id_with_valid_dummy_card"],
        stripe_data["1000yen_monthly_plan_id"]
    );
    console.dir({subscription}, {depth: 4});

    const updated_subscription = await stripe_utils.change_plan_of_subscription(
        subscription.id,
        stripe_data["free_monthly_plan_id"]
    );
    console.dir({updated_subscription}, {depth: 4});

    console.groupEnd();
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  success_scenario_for_paid_plan,
  fail_scenario_for_paid_plan_because_of_no_card,
  fail_scenario_for_paid_plan_because_of_card_declined,
  success_scenario_for_free_plan_and_customer_without_card,
  upgrade_subscription_from_paid_plan,
  upgrade_subscription_from_free_plan,
  downgrade_subscription_to_paid_plan,
  downgrade_subscription_to_free_plan
};
