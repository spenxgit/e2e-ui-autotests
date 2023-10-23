import {TestConfigurator} from "../utils/TestConfigurator";

let loginPage;

fixture`Payments`
    .page(TestConfigurator.getPlatformUrl())
    .beforeEach(async t => {
        let configurator = new TestConfigurator().isUserLoggedIn(false);
        loginPage = await configurator.configure();
    });

test('Test', async t => {

});