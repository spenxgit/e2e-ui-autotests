import {TestConfigurator} from "../utils/TestConfigurator";
import {Users} from "../data/UsersData";
import MainDashboardPage from "../page_objects/MainDashboardPage";
import CardsPage from "../page_objects/CardsPage";
import {Card} from "../models/Cards";

let loginPage;

fixture`Authentication`
    .page(TestConfigurator.getPlatformUrl())
    .beforeEach(async t => {
        let configurator = new TestConfigurator().isUserLoggedIn(false);
        loginPage = await configurator.configure();
    });

test('Login with valid credentials', async t => {
    //steps
    let mainDashboardPage: MainDashboardPage = await loginPage.doLogin(Users.UserA);

    //validation
    await t.expect(await mainDashboardPage.isPageLoaded()).eql(true);
});

test('Login attempt with invalid credentials', async t => {
    //steps
    await loginPage.inputCredentials({email: Users.UserA.email, password: "Wrong Password"});
    loginPage = await loginPage.clickLogInButton(false);

    //validation
    await t.expect(await loginPage.getWrongCredentialsMessage()).eql("Invalid credentials.");
});

test('Temporary', async t => {
    //steps
    let mainDashboardPage: MainDashboardPage = await loginPage.doLogin(Users.UserA);
    let cardsPage: CardsPage = await mainDashboardPage.clickOnCardsNavigationButton();
    let [cardsArray]: Card[] = await cardsPage.getCardsList();
})