import {t, Selector} from 'testcafe';

export default class MainPage {
    private logo: Selector;

    constructor() {
        this.logo = Selector('#Logo');
    }

    async isPageLoaded(): Promise<boolean> {
        //TODO это грязь, переписать параметризированно и добавить ассертов на урл и другие элементы
        await t.expect(Selector('span.the-header-profile-email').withExactText('autotest@spenxy.com').exists).ok({ timeout: 10000 });
        return true;
    }
}