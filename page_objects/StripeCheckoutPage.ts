import {Selector, t} from 'testcafe';
import TestUtils from "../utils/TestUtils";
import {Users} from "../data/UsersData";

export default class StripeCheckoutPage {
    static stripePaymentLink = 'https://buy.stripe.com/eVa01r7yj5OC0yQdQR';
    private paymentAmountInputField: Selector;
    private emailInputField: Selector;
    private cardNumberInputField: Selector;
    private cardExpDateInputField: Selector;
    private cardCVVInputField: Selector;
    private cardOwnerNameInputField: Selector;
    private submitPaymentButton: Selector;

    constructor() {
        this.paymentAmountInputField = Selector('#customUnitAmount');
        this.emailInputField = Selector('#email');
        this.cardNumberInputField = Selector('#cardNumber');
        this.cardExpDateInputField = Selector('#cardExpiry');
        this.cardCVVInputField = Selector('#cardCvc');
        this.cardOwnerNameInputField = Selector('#billingName');
        this.submitPaymentButton = Selector('button[data-testid=\'hosted-payment-submit-button\']');
    }

    static async navigateToStripe(): Promise<StripeCheckoutPage> {
        await t.navigateTo(StripeCheckoutPage.stripePaymentLink);
        return new StripeCheckoutPage();
    }

    async makeAPurchase(unmaskedCard) {
        await TestUtils.typeTextInTextField('1', this.paymentAmountInputField);
        await TestUtils.typeTextInTextField(unmaskedCard.cardUser, this.emailInputField);
        await TestUtils.typeTextInTextField(unmaskedCard.cardUnMaskedNumber, this.cardNumberInputField);
        await TestUtils.typeTextInTextField(unmaskedCard.cardExpDate, this.cardExpDateInputField);
        await TestUtils.typeTextInTextField(unmaskedCard.cardCVV, this.cardCVVInputField);
        await TestUtils.typeTextInTextField('Auto Test', this.cardOwnerNameInputField);
        await t.click(this.submitPaymentButton);
    }
}