import {Selector, t} from 'testcafe';
import {CardsArray} from "../models/Cards";

export default class CardsPage {
    private cardsTable: Selector;
    private card: Selector;
    private cardsArray: CardsArray[] = [];

    constructor() {
        this.cardsTable = Selector('#cards-list');
        this.card = Selector('#app-bank-card')
    }

    async getCardsList(): Promise<CardsArray[]> {
        let cardSelector = await Selector('.app-bank-card')
        this.cardsArray = [];
        for (let i = 0; i < await cardSelector.count; i++) {
            let cardExample = new CardsArray();
            cardExample.cardNickName = (await cardSelector.nth(i).find('.card-header-holder').textContent);
            cardExample.cardBalance = (await cardSelector.nth(i).find('.card-header-balance-value').textContent);
            cardExample.cardMaskedNumber = (await cardSelector.nth(i).find('.app-bank-card-number').textContent);
            cardExample.cardUser = (await cardSelector.nth(i).find('.card-footer-user-email').textContent);
            cardExample.cardStatus = (await cardSelector.nth(i).find('.card-header-meta').textContent);
            this.cardsArray.push(cardExample);
        }
        console.log(this.cardsArray);
        return this.cardsArray;
    }
}