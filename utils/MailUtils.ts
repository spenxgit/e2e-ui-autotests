import {t, Selector} from "testcafe";

export default class MailUtils {

    static async validateSignUpWithMailLink(User) {
        await this.loginToGmail(User);
        await this.openLastEmail();
        await t.navigateTo(await this.getVerificationLink())
    };

    static async loginToGmail(User) {
        await t.navigateTo('https://mail.google.com');
        await t.typeText(Selector('input[type="email"]', {timeout: 20000}), User.email);
        await t.click(Selector('#identifierNext'));
        await t.typeText(Selector('input[type="password"]', {timeout: 20000}), User.password);
        await t.click(Selector('#passwordNext'));
    };

    static async openLastEmail() {
        await t.click(Selector('#\\:1q > span'));
    }

    static async getVerificationLink() {
        const linkSelector = Selector('a').withText('Confirm email');
        const verificationLink = linkSelector.getAttribute('href');
        await t.setNativeDialogHandler(() => false);
        return verificationLink;
    };
}