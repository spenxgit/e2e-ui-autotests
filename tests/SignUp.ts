import {TestConfigurator} from "../utils/TestConfigurator";
import TestUtils from "../utils/TestUtils";
import SignUpPage from "../page_objects/SignUpPage";

let loginPage;

fixture`Authentication`
    .page(TestConfigurator.getPlatformUrl())
    .beforeEach(async t => {
        let configurator = new TestConfigurator().isUserLoggedIn(false);
        loginPage = await configurator.configure();
    });

test('Sign up as a new user', async t => {
    //generate new random email
    let emailForNewUser = TestUtils.getRandomEmailAddress();
    let passwordForNewUser = TestUtils.getRandomPassword();
    console.log(emailForNewUser)
    console.log(passwordForNewUser)

    //sign up with a random email
    let signUpPage: SignUpPage = await loginPage.clickSignUpButton();
    await signUpPage.fillSignUpData('Auto', 'Test', emailForNewUser, passwordForNewUser)

    //TODO wait for feature, sign up is not working

    //validation
});