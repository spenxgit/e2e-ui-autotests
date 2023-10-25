import {t, Selector} from 'testcafe';
import TestUtils from "../utils/TestUtils";
import CardsPage from "./CardsPage";
import CreateCardPage from "./CreateCardPage";

export default class MainDashboardPage {
    private logo: Selector;
    private walletBalance: Selector;
    private cardPageNavButton: Selector;
    private createCardPageNavButton: Selector;

    constructor() {
        this.logo = Selector('#Logo');
        this.walletBalance = Selector('.the-header-balance-amount');
        this.cardPageNavButton = Selector('.block-header-link-title').withText('Cards');
        this.createCardPageNavButton = Selector('[data-qa="app-menu-block-item-CARDS_CREATE"]');
    }

    async isPageLoaded(): Promise<boolean> {
        //TODO это грязь, переписать параметризированно и добавить ассертов на урл и другие элементы
        await t.expect(Selector('span.the-header-profile-email').withExactText('autotest@spenxy.com').exists).ok({ timeout: 10000 });
        return true;
    }

    async clickOnCardsNavigationButton(): Promise<CardsPage> {
        await t.click(this.cardPageNavButton);
        //TODO это грязь, завалится, если юзер новый и у него еще не выпущенно ни одной карты
        await t.expect(Selector('ul.cards-list').exists).ok();
        return new CardsPage();
    }

    async clickOnCreateCardNavigationButton(): Promise<CreateCardPage> {
        await t.click(this.createCardPageNavButton());
        await t.expect(Selector('.create-card-page').exists).ok();
        return new CreateCardPage();
    }

    async getWalletBalance(): Promise<number> {
        const selectorContent = await this.walletBalance;
        const balanceNum = TestUtils.stringToNumberFormat(await selectorContent.textContent, 2);
        return balanceNum;
    }
}