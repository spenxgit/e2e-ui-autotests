import {Selector, t} from 'testcafe';
import {Card} from "../models/Cards";

export default class CardDetailsPage {
    private cardSecureDetailsButton: Selector;
    private cardUser: Selector;
    private cardNumber: Selector;
    private cardExpDate: Selector;
    private cardCVV: Selector;
    private cardBalance: Selector;

    constructor() {
        this.cardSecureDetailsButton = Selector('.card-security-details-action-button');
        this.cardUser = Selector('.app-definition-list-group .app-definition-list:nth-child(1) .app-definition-list-item-description');
        this.cardNumber = Selector('.app-definition-list-group .app-definition-list:nth-child(2) .app-definition-list-item-description');
        this.cardExpDate = Selector('.app-definition-list-group .app-definition-list:nth-child(3) .app-definition-list-item-description');
        this.cardCVV = Selector('.app-definition-list-group .app-definition-list:nth-child(4) .app-definition-list-item-description');
        this.cardBalance = Selector('.actions-header-details-balance');
    }

    async getUnmaskedCard(): Promise<Card> {
        await t.click(this.cardSecureDetailsButton);
        let unmaskedCard = new Card();
        unmaskedCard.cardUser = await Selector(this.cardUser).textContent;
        unmaskedCard.cardUnMaskedNumber = await Selector(this.cardNumber).textContent;
        unmaskedCard.cardExpDate = await Selector(this.cardExpDate).textContent;
        unmaskedCard.cardCVV = await Selector(this.cardCVV).textContent;
        return unmaskedCard;
    }

    async getCardBalance(): Promise<number> {
        const balanceText = await this.cardBalance.innerText;
        const balance = parseFloat(balanceText);
        return balance;
    }
}