import {TestConfigurator} from "../utils/TestConfigurator";
import TestUtils from "../utils/TestUtils";

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
    let passwordForNewUser = TestUtils.getRandomPassword()

    //sign up with a random email
    console.log(emailForNewUser)
    console.log(passwordForNewUser)

    //validation
});