const stripe = require("stripe")(process.env.token);


/**
 * @param customer_email
 */
stripe_create_customer = customer_email => {
    stripe.customers.create(
        {
            email: customer_email
        },
        function(err, customer) {
            // asynchronously called
            console.log(customer);
        }
    );
};

/**
 *
 * @param id 顧客のID
 * @param num カード番号
 * @param month カードの有効期限
 * @param year カードの有効期限
 * @param cvc カードのセキュリティ番号
 */
stripe_create_card = (id, num, month, year, cvc) => {
    console.log(id, num, month, year, cvc);
    stripe.tokens.create(
        {
            card: {
                number: num,
                exp_month: month,
                exp_year: year,
                cvc: cvc
            }
        },
        (err, token) => {
            const params = {
                source: token.id
            };
            stripe.customers.createSource(id, params, (err, card) => {
                console.log(card);
            });
        }
    );
};

/**
 * @param price 請求価格
 * @param description 説明
 * @param customer_id 顧客のID
 */
stripe_charge = (price, description, customer_id) => {
    const charge = stripe.charges.create({
        amount: price,
        currency: "jpy",
        description: description,
        customer: customer_id
    });
    console.log(charge);
};
