import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Page from "~/app/[lang]/page";
import { mockedCookies } from "../_helper/mocks";

const mockSessionResult = () => ({
  user: {
    id: "1",
    username: "testing.account",
    firstName: "Testing",
    lastName: "Account",
    email: "testing.account@gmail.com",
    name: "Testing Account",
    gender: "other",
    image: "https://example.com/image.png",
    token: "token",
  },
  expires: new Date().toISOString(),
});

jest.mock("next/headers", () => ({
  cookies: jest.fn().mockReturnValue(
    // emulate the cookies() function from next/headers
    mockedCookies(),
  ),
}));

// must pre-mock for compiling successfully
jest.mock("~/server/auth", () => ({
  auth: jest.fn().mockResolvedValue(null),
}));

describe("/[lang] - HomePage - Unauthenticated", () => {
  it("renders heading in correct language [vi]", async () => {
    const fakePageParams = {
      params: {
        lang: "vi",
      },
    };

    // little hack to workaround the server component.
    render(await Page(fakePageParams));
    const dictionaryVi = await import("~/i18n/vi.json").then((m) => m.default);
    const headingText =
      dictionaryVi["homepage-page"][
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        "welcome-visitor"
      ];
    const heading = screen.getByRole("heading", { level: 1 });

    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent(headingText);
  });

  // render english correctly
  it("renders heading in correct language [en]", async () => {
    const fakePageParams = {
      params: {
        lang: "en",
      },
    };

    // little hack to workaround the server component.
    render(await Page(fakePageParams));
    const dictionaryEn = await import("~/i18n/en.json").then((m) => m.default);
    const headingText =
      dictionaryEn["homepage-page"][
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        "welcome-visitor"
      ];
    const heading = screen.getByRole("heading", { level: 1 });

    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent(headingText);
  });
});

describe("/[lang] - HomePage - Authenticated", () => {
  let mockedAuth: jest.Mock;

  beforeEach(async () => {
    const { auth } = await import("~/server/auth");
    mockedAuth = auth as jest.Mock;
    mockedAuth.mockResolvedValue(mockSessionResult());
  });

  // render heading correctly when user is logged in
  it("renders authenticated heading in correct language [vi]", async () => {
    const fakePageParams = {
      params: {
        lang: "vi",
      },
    };

    // little hack to workaround the server component.
    render(await Page(fakePageParams));
    const dictionaryVi = await import("~/i18n/vi.json").then((m) => m.default);
    const headingText =
      dictionaryVi["homepage-page"][
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        "welcome"
      ];
    const populatedHeadingText = headingText.replace(
      "{{name}}",
      mockSessionResult().user.name,
    );
    const heading = screen.getByRole("heading", { level: 1 });

    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent(populatedHeadingText);
  });

  // render english correctly
  it("renders authenticated heading in correct language [en]", async () => {
    const fakePageParams = {
      params: {
        lang: "en",
      },
    };

    // little hack to workaround the server component.
    render(await Page(fakePageParams));
    const dictionaryEn = await import("~/i18n/en.json").then((m) => m.default);
    const headingText =
      dictionaryEn["homepage-page"][
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        "welcome"
      ];
    const populatedHeadingText = headingText.replace(
      "{{name}}",
      mockSessionResult().user.name,
    );
    const heading = screen.getByRole("heading", { level: 1 });

    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent(populatedHeadingText);
  });

  // in case the name is not present (e.g. user is logged in via social account)
  it("renders authenticated heading in correct language [en] - no name", async () => {
    // override the result from mockAuth
    mockedAuth.mockResolvedValue({
      ...mockSessionResult(),
      user: {
        ...mockSessionResult().user,
        name: undefined,
      },
    });
    const fakePageParams = {
      params: {
        lang: "en",
      },
    };

    // little hack to workaround the server component.
    render(await Page(fakePageParams));
    const dictionaryEn = await import("~/i18n/en.json").then((m) => m.default);
    const headingText =
      dictionaryEn["homepage-page"][
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        "welcome"
      ];
    const populatedHeadingText = headingText.replace(
      "{{name}}",
      mockSessionResult().user.email,
    );
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent(populatedHeadingText);
  });

  // in case the name is not present (e.g. user is logged in via social account) (vi)
  it("renders authenticated heading in correct language [vi] - no name", async () => {
    // override the result from mockAuth
    mockedAuth.mockResolvedValue({
      ...mockSessionResult(),
      user: {
        ...mockSessionResult().user,
        name: undefined,
      },
    });
    const fakePageParams = {
      params: {
        lang: "vi",
      },
    };

    // little hack to workaround the server component.
    render(await Page(fakePageParams));
    const dictionaryVi = await import("~/i18n/vi.json").then((m) => m.default);
    const headingText =
      dictionaryVi["homepage-page"][
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        "welcome"
      ];
    const populatedHeadingText = headingText.replace(
      "{{name}}",
      mockSessionResult().user.email,
    );
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent(populatedHeadingText);
  });
});
