import {TestConfigurator} from "../utils/TestConfigurator";
import {Users} from "../data/UsersData";
import StripeCheckoutPage from "../page_objects/StripeCheckoutPage";

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

    let stripeCheckoutPage = await StripeCheckoutPage.navigateToStripe();
    await stripeCheckoutPage.makeAPurchase(unmaskedCard);

    //TODO вернуться на страницу карты
    //TODO свалидировать изменение суммы на кошельке и на карте после операции
});

