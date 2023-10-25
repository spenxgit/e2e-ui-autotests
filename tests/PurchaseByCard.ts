import {TestConfigurator} from "../utils/TestConfigurator";
import {Users} from "../data/UsersData";
import StripeCheckoutPage from "../page_objects/StripeCheckoutPage";
import CardsPage from "../page_objects/CardsPage";

let mainDashboardPage;
let cardsPage;

fixture`Purchase by card`
    .page(TestConfigurator.getPlatformUrl())
    .beforeEach(async t => {
        let configurator = new TestConfigurator().setTestUser(Users.UserA).isUserLoggedIn(true)
        mainDashboardPage = await configurator.configure();
        cardsPage = await mainDashboardPage.clickOnCardsNavigationButton();
    });

test('DEV-169 Purchase by card', async t => {
    let cardsArray = await cardsPage.getCardsList();
    let cardForPurchase = await cardsPage.findFirstValidForPurchaseCard(cardsArray);
    let cardDetailsPage = await cardsPage.clickOnCard(cardForPurchase);

    let unmaskedCardForPurchase = await cardDetailsPage.getUnmaskedCard();
    let cardBalanceBeforePurchase = await cardDetailsPage.getCardBalance();
    let walletBalanceBeforePurchase = await mainDashboardPage.getWalletBalance();

    let stripeCheckoutPage = await StripeCheckoutPage.navigateToStripe();
    await stripeCheckoutPage.makeAPurchase(unmaskedCardForPurchase);

    cardsPage = await CardsPage.navigateToCardsPage();
    cardDetailsPage = await cardsPage.clickOnCard(cardForPurchase);

    let cardBalanceAfterPurchase = await cardDetailsPage.getCardBalance();
    let walletBalanceAfterPurchase = await mainDashboardPage.getWalletBalance();

    await t.expect(cardBalanceBeforePurchase).eql(cardBalanceAfterPurchase + 0);
    await t.expect(walletBalanceBeforePurchase).eql(walletBalanceAfterPurchase + 0);


    //TODO добавить в валидацию реальные цифры вместо нулей отражающие затраты на покупку и комиссию
    //TODO добавить выпуск карты если findFirstValidForPurchaseCard не возвращает карт
    //TODO парамаетризировать сумму покупки
    //TODO добавить параметризацию в тест чтобы проверять покупку картой каждого БИНа
});

