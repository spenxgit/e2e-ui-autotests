import {Selector, t} from 'testcafe';
import TestUtils from "../utils/TestUtils";
import MainDashboardPage from "./MainDashboardPage";

export default class LoginPage {
    private emailInputField: Selector;
    private passwordInputField: Selector;
    private logInButton: Selector;
    private loginErrorMessage: Selector

    constructor() {
        this.emailInputField = Selector('#email', {timeout: 10000});
        this.passwordInputField = Selector('#password', {timeout: 10000});
        this.logInButton = Selector('button.button[type="submit"]', {timeout: 10000}).withText('Log in');
        this.loginErrorMessage = Selector('.app-error-modal-content-text', {timeout: 10000});
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
}