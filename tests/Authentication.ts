import {Users} from "../data/UsersData";
import {TestConfigurator} from "../utils/TestConfigurator";
import MainDashboardPage from "../page_objects/MainDashboardPage";

let loginPage;

fixture`Authentication`
    .page(TestConfigurator.getPlatformUrl())
    .beforeEach(async t => {
        let configurator = new TestConfigurator().isUserLoggedIn(false);
        loginPage = await configurator.configure();
    });

test('DEV-504 Login with valid credentials', async t => {
    //steps
    let mainDashboardPage: MainDashboardPage = await loginPage.doLogin(Users.UserA);

    //validation
    await t.expect(await mainDashboardPage.isPageLoaded()).eql(true);
});

test('DEV-501 Login attempt with invalid credentials', async t => {
    //steps
    await loginPage.inputCredentials({email: Users.UserA.email, password: "Wrong Password"});
    loginPage = await loginPage.clickLogInButton(false);

    //validation
    await t.expect(await loginPage.getWrongCredentialsMessage()).eql("Invalid credentials.");
});