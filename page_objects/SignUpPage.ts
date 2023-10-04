import {Selector, t} from 'testcafe';
import TestUtils from "../utils/TestUtils";


export default class SignUpPage {
    private firstNameInputField: Selector;
    private lastNameInputField: Selector;
    private emailInputField: Selector;
    private passwordInputField: Selector;
    private signUpButton: Selector;

    constructor() {
        this.firstNameInputField = Selector('#first-name', {timeout: 10000});
        this.lastNameInputField = Selector('#last-name', {timeout: 10000});
        this.emailInputField = Selector('#email', {timeout: 10000});
        this.passwordInputField = Selector('#password', {timeout: 10000});
        this.signUpButton = Selector('button.button[type="submit"]', {timeout: 10000}).withText('Sign up');
    }

    async fillSignUpData(firstName, lastName, email, password) {
        await TestUtils.typeTextInTextField(firstName, this.firstNameInputField);
        await TestUtils.typeTextInTextField(lastName, this.lastNameInputField);
        await TestUtils.typeTextInTextField(email, this.emailInputField);
        await TestUtils.typeTextInTextField(password, this.passwordInputField)
    }

    async
}