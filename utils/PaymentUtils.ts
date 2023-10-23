import {t, Selector} from "testcafe";

export default class PaymentUtils {

    static async validateSignUpWithMailLink() {
        await this.getAuthToken();
        await this.makePayment();
    };

    static async getAuthToken(): Promise<string> {
        let response = await t.request({
            url: 'https://api.stripe.com/v1/customers',
            method: 'post',
            headers: {
                "Authorization": "Bearer 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"
            }
        });
        return await response.body["id"];
    }

    static async makePayment(): Promise<string> {
        let response = await t.request({
            url: 'https://api.stripe.com/v1/payment_methods',
            method: 'post',
            params: {
                "type": "card",
                "billing_details[address][postal_code]": "1234",
                "card[number]": "5110230005511562",
                "card[cvc]": "647",
                "card[exp_month]": "10",
                "card[exp_year]": "25",
                "guid": "9c88305b-d91b-4444-903a-b0d07d8e894e556a1f",
                "muid": "1c591a59-9854-4106-8f52-13a7e6c3ed0a1c9fb7",
                "sid": "12c85513-9150-4df0-8651-16b5889298cef8c8f3",
                "payment_user_agent": "stripe.js/7e8ee2cfca; stripe-js-v3/7e8ee2cfca; card-element; dashboard",
                "key": "pk_live_51NgXAxIosAYm40mKrU8r2Drlc7OifucuSGpbRgsh4JtLFTIKTNmGSAQ1VRZQNbOtN3QQTtiOHhDyrKRvzpXihhgR00FrCQMCS9"
            }
        });
        console.log(response);
        return await response.body[""];
    }
}