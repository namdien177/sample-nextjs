import { type Dictionary } from "~/libs/i18n/dictionary";
import t from "~/libs/i18n/translate";

const BASE_URL = "http://localhost:3000";

describe("Able to sign in", () => {
  beforeEach(() => {
    cy.visit(BASE_URL);
  });

  // should be able to navigate to sign-in page when click login-button
  it("should be able to navigate to sign-in page when click login-button", () => {
    cy.get("a").contains("Login").first().should("exist").click();
    cy.wait(1000); // timeout
    cy.url().should("match", new RegExp(`${BASE_URL}/(en|vi)/sign-in`));

    // should have heading h1 = login page
    cy.get("h1").contains("Login page").first().should("exist");
  });

  // should be able to sign in with valid credentials
  it("should be able to sign in with valid credentials", () => {
    cy.get("a").contains("Login").first().should("exist").click();
    cy.wait(1000); // timeout
    cy.url().should("match", new RegExp(`${BASE_URL}/(en|vi)/sign-in`));

    // should have heading h1 = login page
    cy.get("h1").contains("Login page").first().should("exist");

    // fill in email and password
    cy.get("input[name=username]").type("atuny0");
    cy.get("input[name=password]").type("9uQFF1Lh");
    cy.get("button[type=submit]").click();
    cy.wait(1000); // timeout
    cy.url()
      .should("match", new RegExp(`${BASE_URL}/(en|vi)`))
      .then(async (url) => {
        let dictionary: Dictionary | undefined;
        if (url.includes("/vi")) {
          dictionary = await import(`~/i18n/vi.json`).then(
            (module) => module.default,
          );
        } else {
          dictionary = await import(`~/i18n/en.json`).then(
            (module) => module.default,
          );
        }

        expect(dictionary).to.not.be.undefined;
        const expectHeading = t("homepage-page.welcome", dictionary, {
          name: "atuny0@sohu.com",
        });
        expect(expectHeading).to.not.undefined;
        cy.get("h1").contains(expectHeading).first().should("exist");
      });
  });
});
