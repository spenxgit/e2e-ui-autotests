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
        return generatedEmail;
    }

    static getRandomPassword(): string {
        let generatedPassword = uuidv4();
        return generatedPassword;
    }

    static stringToNumberFormat(value: string, precision: number): number {
        let tmp = Number(
            value
                .replace(/[^+\d]/g, '')
        );

        return TestUtils.roundNumber(tmp / 10 ** precision, precision);
    }

    static roundNumber(number: number, digits: number): number {
        let multiple = Math.pow(10, digits);
        return Math.round(number * multiple) / multiple;
    }
}



