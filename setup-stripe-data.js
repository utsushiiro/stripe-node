const stripe_utils = require("./stripe-utils");

(async () => {
  try {
    const stripe_data_json = {};

    const product = await stripe_utils.create_service_product("Sample Service");
    stripe_data_json["sample_service_product_id"] = product.id;

    stripe_data_json[
      "free_monthly_plan_id"
    ] = (await stripe_utils.create_monthly_plan(
      product.id,
      "Sample Service free Plan",
      0
    )).id;

    stripe_data_json[
      "1000yen_monthly_plan_id"
    ] = (await stripe_utils.create_monthly_plan(
      product.id,
      "Sample Service 1000yen per month Plan",
      1000
    )).id;

    stripe_data_json[
        "3000yen_monthly_plan_id"
        ] = (await stripe_utils.create_monthly_plan(
        product.id,
        "Sample Service 3000yen per month Plan",
        3000
    )).id;

    stripe_data_json[
      "customer_id_with_valid_dummy_card"
    ] = (await stripe_utils.create_customer_with_dummy_card(
      "utsushiiro-with-valid-card@example.com",
      false
    )).id;

    stripe_data_json[
      "customer_id_with_invalid_dummy_card"
    ] = (await stripe_utils.create_customer_with_dummy_card(
      "utsushiiro-with-invalid-card@example.com",
      true
    )).id;

    stripe_data_json[
      "customer_id_without_card"
    ] = (await stripe_utils.create_customer_without_card(
      "utsushiiro-without-card@example.com"
    )).id;

    require("fs").writeFile(
      "./stripe-data.json",
      JSON.stringify(stripe_data_json),
      () => {}
    );
  } catch (err) {
    console.log(err);
  }
})();
