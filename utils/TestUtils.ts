import {Selector, t} from 'testcafe';

export default class TestUtils {
    static async typeTextInTextField(text: string, element: Selector) {
        await t
            .click(element)
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText(element, text);
    }
}



