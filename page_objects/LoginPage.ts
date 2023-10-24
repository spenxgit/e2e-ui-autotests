import {Selector, t} from 'testcafe';
import TestUtils from "../utils/TestUtils";
import MainDashboardPage from "./MainDashboardPage";
import SignUpPage from "./SignUpPage";

export default class LoginPage {
    private emailInputField: Selector;
    private passwordInputField: Selector;
    private logInButton: Selector;
    private loginErrorMessage: Selector;
    private signUpButton: Selector;

    constructor() {
        this.emailInputField = Selector('#email');
        this.passwordInputField = Selector('#password');
        this.logInButton = Selector('button.button[type="submit"]').withText('Log in');
        this.loginErrorMessage = Selector('.app-error-modal-content-text');
        this.signUpButton = Selector('.card-footer-button').withText('Sign up');
    }

    async doLogin({email, password}): Promise<MainDashboardPage> {
        await this.inputCredentials({email, password});
        await this.clickLogInButton(true);
        return new MainDashboardPage();
    }

    async inputCredentials({email, password}): Promise<LoginPage> {
        await TestUtils.typeTextInTextField(email, this.emailInputField);
        await TestUtils.typeTextInTextField(password, this.passwordInputField);
        return this;
    }

    async clickLogInButton(areCredentialsCorrect: Boolean): Promise<LoginPage | MainDashboardPage> {
        await t.click(this.logInButton);

        if (areCredentialsCorrect === true) {
            return new MainDashboardPage();
        } else {
            return new LoginPage();
        }
    }

    async getWrongCredentialsMessage(): Promise<String> {
        return await this.loginErrorMessage.innerText;
    }

    async clickSignUpButton(): Promise<SignUpPage> {
        await t.click(this.signUpButton)
        return new SignUpPage();
    }
}