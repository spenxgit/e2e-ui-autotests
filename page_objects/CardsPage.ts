import {Selector, t} from 'testcafe';
import {Card} from "../models/Cards";
import CardDetailsPage from "./CardDetailsPage";

export default class CardsPage {
    static cardsPageURL = 'https://wlspenxy.dev.apps.spenxy.com/cards';
    private cardsTable: Selector;
    private card: Selector;
    private cardsArray: Card[] = [];

    constructor() {
        this.cardsTable = Selector('#cards-list');
        this.card = Selector('#app-bank-card')
    }

    static async navigateToCardsPage(): Promise<CardsPage> {
        await t.setNativeDialogHandler(() => true)
        await t.navigateTo(CardsPage.cardsPageURL);
        return new CardsPage();
    }

    async getCardsList(): Promise<Card[]> {
        let cardSelector = await Selector('.app-bank-card')
        this.cardsArray = [];
        for (let i = 0; i < await cardSelector.count; i++) {
            let cardExample = new Card();
            cardExample.cardNickName = (await cardSelector.nth(i).find('.card-header-holder').textContent);
            cardExample.cardBalance = (await cardSelector.nth(i).find('.card-header-balance-value').textContent);
            cardExample.cardMaskedNumber = (await cardSelector.nth(i).find('.app-bank-card-number').textContent);
            cardExample.cardUser = (await cardSelector.nth(i).find('.card-footer-user-email').textContent);
            cardExample.cardStatus = (await cardSelector.nth(i).find('.card-header-meta').textContent);
            this.cardsArray.push(cardExample);
        }
        return this.cardsArray;
    }

    async findFirstValidForPurchaseCard(cards): Promise<Card> {
        for (let i = 0; i < cards.length; i++) {
            const card = cards[i];
            if (card.cardStatus === '' && parseFloat(card.cardBalance.replace(',', '.')) > 1.50) {
                return card;
            }
        }
        return null;
    }

    async clickOnCard(card): Promise<CardDetailsPage> {
        await t.click(Selector('.app-bank-card-number').withText(card.cardMaskedNumber));
        return new CardDetailsPage();
    }
}