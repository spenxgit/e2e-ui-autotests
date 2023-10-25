import {Selector, t} from 'testcafe';

export default class CreateCardPage {
    static createCardPageURL = 'https://wlspenxy.dev.apps.spenxy.com/cards';

    constructor() {

    }

    async createCard(bin, cardUser, cardNickname, maxTransactionLimit) {
        await this.clickOnTheBIN(bin);
        await this.selectCardUser(cardUser);
        await this.setCardNickName(cardNickname);
        await this.setMaxTransactionLimit(maxTransactionLimit);
    }

    async clickOnTheBIN(bin) {
        const createCardButton = Selector('tr').withText(bin).find('button').withText('Create card');
        await t.click(createCardButton);
    }

    async selectCardUser(cardUser) {

    }

    async setCardNickName(cardNickname) {

    }

    async setMaxTransactionLimit(maxTransactionLimit) {

    }
}