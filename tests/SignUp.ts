import {TestConfigurator} from "../utils/TestConfigurator";
import {User, Users} from "../data/UsersData";
import TestUtils from "../utils/TestUtils";
import MailUtils from "../utils/MailUtils";
import SignUpPage from "../page_objects/SignUpPage";
import MainDashboardPage from "../page_objects/MainDashboardPage";

let loginPage;

fixture`Sign up`
    .page(TestConfigurator.getPlatformUrl())
    .beforeEach(async t => {
        let configurator = new TestConfigurator().isUserLoggedIn(false);
        loginPage = await configurator.configure();
    });

test('Sign up as a new user', async t => {
    //generate new random email
    let newUser: User = new User(TestUtils.getRandomEmailAddress(),TestUtils.getRandomPassword());

    //sign up with a random email
    let signUpPage: SignUpPage = await loginPage.clickSignUpButton();
    await signUpPage.fillSignUpData('Auto', 'Test', newUser.email, newUser.password)
    await MailUtils.validateSignUpWithMailLink(Users.UserA);

    //validation
    await t.navigateTo(TestConfigurator.platformUrl);
    let mainDashboardPage: MainDashboardPage = await loginPage.doLogin(newUser);

    //TODO дописать верификацию когда сайнап будет готов
});
