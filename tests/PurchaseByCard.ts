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

test('Purchase by card', async t => {
    let cardsArray = await cardsPage.getCardsList();
    let cardForPurchase = await cardsPage.findFirstValidForPurchaseCard(cardsArray);
    let cardDetailsPage = await cardsPage.clickOnCard(cardForPurchase);
    let unmaskedCard = await cardDetailsPage.getUnmaskedCard();

    let cardBalanceBeforePurchase = await cardDetailsPage.getCardBalance();
    let walletBalanceBeforePurchase = await mainDashboardPage.getWalletBalance();

    let stripeCheckoutPage = await StripeCheckoutPage.navigateToStripe();
    await stripeCheckoutPage.makeAPurchase(unmaskedCard);

    cardsPage = await CardsPage.navigateToCardsPage();
    cardDetailsPage = await cardsPage.clickOnCard(cardForPurchase);
    let cardBalanceAfterPurchase = await cardDetailsPage.getCardBalance();
    let walletBalanceAfterPurchase = await mainDashboardPage.getWalletBalance();

    //TODO добавить выпуск карты если findFirstValidForPurchaseCard не возвращает карт
    //TODO добавить параметризацию в тест чтобы проверять покупку картой каждого БИНа
});

