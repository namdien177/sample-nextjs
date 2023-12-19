import { type Dictionary, getDictionary } from "~/libs/i18n/dictionary";
import t from "~/libs/i18n/translate";

const BASE_URL = "http://localhost:3000";

describe("Able to navigate from homepage to sign-in page", () => {
  beforeEach(() => {
    cy.visit(BASE_URL);
  });

  // should have login-button
  it("should render homepage and have login button", () => {
    cy.get("a").contains("Login").should("exist");

    // get the /[lang] from URL and check if it is equal to "en" or "vi"
    cy.url()
      .should("match", /\/(en|vi)/)
      .then(
        // if it is "en" then the text should be "Login"
        async (url) => {
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
          // if dictionary is undefined, then the test will fail
          expect(dictionary).to.not.be.undefined;
          const expectHeading = t("homepage-page.welcome-visitor", dictionary);
          // if expectHeading is undefined, then the test will fail
          expect(expectHeading).to.not.undefined;
          // check the heading h1 = expectHeading
          cy.get("h1").contains(expectHeading).first().should("exist");
        },
      );
  });

  // should be able to navigate to sign-in page when click login-button
  it("should be able to navigate to sign-in page when click login-button", () => {
    cy.get("a").contains("Login").first().should("exist").click();
    cy.wait(1000); // timeout
    cy.url().should("include", "/sign-in");

    // should have heading h1 = login page
    cy.get("h1").contains("Login page").first().should("exist");
  });
});
