import { render, screen } from "@testing-library/react";
import Page from "~/app/[lang]/sign-in/page";
import { jestWaitFor } from "../../_helper/mocks";
import userEvent from "@testing-library/user-event";

// mock auth
jest.mock("~/server/auth", () => ({
  auth: jest.fn().mockResolvedValue(null),
}));
// mock router from next
jest.mock("next/navigation", () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
    refresh: jest.fn(),
  }),
  redirect: jest.fn(),
}));

jest.mock("next-auth/react", () => ({
  signIn: jest.fn(),
}));

describe("/[lang]/sign-in - Sign In - Unauthenticated", () => {
  let mockedSignIn: jest.Mock;
  let mockedRouterPush: jest.Mock;
  let mockedRouterRefresh: jest.Mock;

  beforeEach(async () => {
    const { signIn } = await import("next-auth/react");
    // get the signIn mock instance
    mockedSignIn = signIn as jest.Mock;

    // mock the router push
    const { useRouter } = await import("next/navigation");
    const mockedRouter = useRouter() as unknown as Record<
      "push" | "refresh",
      jest.Mock
    >;
    mockedRouterPush = mockedRouter.push;
    mockedRouterRefresh = mockedRouter.refresh;
  });

  it("should render sign in page", async () => {
    render(await Page());

    // get render heading
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent("Login page");

    // get username label and input
    const usernameInput = screen.getByLabelText("username");
    expect(usernameInput).toBeInTheDocument();
    expect(usernameInput).toHaveAttribute("type", "text");

    // get password label and input
    const passwordInput = screen.getByLabelText("password");
    expect(passwordInput).toBeInTheDocument();
    expect(passwordInput).toHaveAttribute("type", "password");

    // get the button submit
    const buttonSubmit = screen.getByRole("button", { name: /login/i });
    expect(buttonSubmit).toBeInTheDocument();
  });

  it("should render 'Invalid Credentials' when login failed (401)", async () => {
    const user = userEvent.setup();
    render(await Page());

    // mock the failed response
    mockedSignIn.mockResolvedValue({
      error: "Invalid credentials",
      status: 401,
    });

    // get username label and input
    const usernameInput = screen.getByLabelText<HTMLInputElement>("username");
    expect(usernameInput).toBeInTheDocument();
    expect(usernameInput).toHaveAttribute("type", "text");
    // fake the value in
    await user.type(usernameInput, "username");
    // expect the value in the input is correct
    expect(usernameInput).toHaveValue("username");

    // get password label and input
    const passwordInput = screen.getByLabelText<HTMLInputElement>("password");
    expect(passwordInput).toBeInTheDocument();
    expect(passwordInput).toHaveAttribute("type", "password");
    // fake the value
    await user.type(passwordInput, "password");
    // expect the value in the input is correct
    expect(passwordInput).toHaveValue("password");

    // get the button submit
    const buttonSubmit = screen.getByRole("button", { name: /login/i });
    expect(buttonSubmit).toBeInTheDocument();

    // click the button
    await user.click(buttonSubmit);

    await jestWaitFor(3000);

    // expect the mockedSignIn run
    expect(mockedSignIn).toHaveBeenCalledTimes(1);
    expect(mockedSignIn).toBeCalledWith("credentials", {
      username: "username",
      password: "password",
      redirect: false,
    });

    // expect the router push not run
    expect(mockedRouterPush).not.toBeCalled();

    // get the error message
    const errorMessage = screen.getByText(/invalid credentials/i);
    expect(errorMessage).toBeInTheDocument();
  });
});
