import {TestConfigurator} from "../utils/TestConfigurator";
import {Users} from "../data/UsersData";

let mainDashboardPage;
let createCardPage;

fixture`Create card`
    .page(TestConfigurator.getPlatformUrl())
    .beforeEach(async t => {
        let configurator = new TestConfigurator().setTestUser(Users.UserA).isUserLoggedIn(true)
        mainDashboardPage = await configurator.configure();
        createCardPage = await mainDashboardPage.clickOnCreateCardNavigationButton();
    });

test('Create card with 54054200 BIN', async t => {
    let bin = '54054200';
    let cardUser = '';
    let cardNickname ='';
    let maxTransactionLimit = '';
    await createCardPage.createCard(bin, cardUser, cardNickname, maxTransactionLimit);
});