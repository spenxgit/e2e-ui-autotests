import {Selector, t} from 'testcafe';
import {v4 as uuidv4} from 'uuid';

export default class TestUtils {

    static async typeTextInTextField(text: string, element: Selector) {
        await t
            .click(element)
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText(element, text);
    }

    static getRandomEmailAddress(): string {
        let generatedEmail = "autotest+" + uuidv4() + "@spenxy.com";
        console.log("Generated email is: " + generatedEmail);
        return generatedEmail;
    }

    static getRandomPassword(): string {
        let generatedPassword = uuidv4();
        console.log("Generated password is: " + generatedPassword);
        return generatedPassword;
    }
}



