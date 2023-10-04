import LoginPage from "../page_objects/LoginPage";
import MainDashboardPage from "../page_objects/MainDashboardPage";

export class TestConfigurator {

    static platformUrl = "https://wlspenxy.dev.apps.spenxy.com/login";
    private testUser;
    private isLoggedIn = false;
    private loginPage = new LoginPage();

    constructor() {
    }

    static getPlatformUrl(): string {
        return this.platformUrl;
    }

    isUserLoggedIn(isLoggedIn: boolean): TestConfigurator {
        this.isLoggedIn = isLoggedIn;
        return this;
    }

    async configure(): Promise<MainDashboardPage | LoginPage> {
        if (this.isLoggedIn) {
            return this.loginPage.doLogin(this.testUser);
        } else {
            return this.loginPage;
        }
    }
}