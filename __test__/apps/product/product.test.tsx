import { type PaginationMeta } from "~/libs/typings/pagination";
import type Product from "~/libs/model/product";
import Page from "~/app/[lang]/product/page";
import { render, screen } from "@testing-library/react";

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

const sampleProduct = (): Product => ({
  id: 1,
  title: "Product 1",
  price: 1000,
  description: "Description 1",
  images: [],
  thumbnail: "https://example.com/image.png",
  brand: "Brand 1",
  category: "Category 1",
  discountPercentage: 0,
  rating: 0,
  stock: 0,
});

const mockListProductResult = (): { products: Product[] } & PaginationMeta => ({
  products: [],
  total: 0,
  skip: 0,
  limit: 0,
});

// must pre-mock for compiling successfully
jest.mock("~/server/auth", () => ({
  auth: jest.fn().mockResolvedValue(null),
}));

// mock "~/libs/ky/ky.server"
jest.mock("~/libs/ky/ky.server", () => {
  return {
    __esModule: true,
    default: jest.fn().mockResolvedValue({}),
  };
});

describe("/[lang]/product - Product List", () => {
  // mock the auth session to access the page.
  let mockedAuth: jest.Mock;
  let mockedKyServer: jest.Mock;

  beforeEach(async () => {
    const { auth } = await import("~/server/auth");
    mockedAuth = auth as jest.Mock;
    mockedAuth.mockResolvedValue(mockSessionResult());

    // mock
    const { default: getKyServer } = await import("~/libs/ky/ky.server");
    mockedKyServer = getKyServer as jest.Mock;
    mockedKyServer.mockResolvedValue({
      get: jest.fn().mockReturnValue({
        json: jest.fn().mockResolvedValue(mockListProductResult()),
      }),
    });
  });

  it("should render successfully", async () => {
    const defaultPageProps = {
      params: { lang: "vi" },
      searchParams: {},
    };
    render(await Page(defaultPageProps));
    const headings = screen.getAllByRole("heading", {
      level: 1,
    });
    // first heading
    const heading = headings[0];

    expect(heading).toBeInTheDocument();
    expect(heading?.parentElement?.tagName).toBe("DIV");
    // content should be "Products"
    expect(heading).toHaveTextContent("Products (0 items)");
    // expect the previous sibling to be <Link href="/vi/product">Products</Link>
    expect(heading?.previousElementSibling?.tagName).toBe("A");
    expect(heading?.previousElementSibling).toHaveAttribute(
      "href",
      `/${defaultPageProps.params.lang}`,
    );
  });

  // render with 1 item
  it("should render successfully with 1 item", async () => {
    // mock mockedListProduct
    const arrProducts = [sampleProduct()] as const;
    mockedKyServer.mockResolvedValue({
      get: jest.fn().mockReturnValue({
        json: jest.fn().mockResolvedValue({
          products: arrProducts,
          total: 1,
          skip: 0,
          limit: 10,
        }),
      }),
    });

    const defaultPageProps = {
      params: { lang: "vi" },
      searchParams: {},
    };
    const page = render(await Page(defaultPageProps));
    // check if the heading displays correctly and is wrapped in Link component.
    const headings = screen.getAllByRole("heading", {
      level: 1,
    });
    const heading = headings[0];
    expect(heading).toBeInTheDocument();
    // content should be "Products"
    expect(heading).toHaveTextContent(`Products (${arrProducts.length} items)`);
    expect(heading?.previousElementSibling?.tagName).toBe("A");
    // expect the previous element link to have href="/vi/product"
    expect(heading?.previousElementSibling).toHaveAttribute(
      "href",
      `/${defaultPageProps.params.lang}`,
    );

    // expect the document to contains 1 link item with the id of `product-item-${arrProducts[0].id}`
    const linkItem = page.container.querySelector(
      `#product-item-${arrProducts[0].id}`,
    );
    expect(linkItem).toBeInTheDocument();
    // expect the link item to have href="/vi/product/1"
    expect(linkItem).toHaveAttribute(
      "href",
      `/${defaultPageProps.params.lang}/product/${arrProducts[0].id}`,
    );
  });
});
