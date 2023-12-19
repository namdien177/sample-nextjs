import { getListProduct, getProductDetail } from "~/server/products/query"; // mock "~/libs/ky/ky.server"

// mock "~/libs/ky/ky.server"
jest.mock("~/libs/ky/ky.server", () => {
  return {
    __esModule: true,
    default: jest.fn().mockResolvedValue({}),
  };
});

describe("[API - /products] Product List", () => {
  let mockedKyServer: jest.Mock;

  beforeEach(async () => {
    const { default: getKyServer } = await import("~/libs/ky/ky.server");
    mockedKyServer = getKyServer as jest.Mock;
  });

  // should fallback to default searchParams if no queryOptions provided
  it("should fallback to default searchParams if no queryOptions provided", async () => {
    const mockedResponse = {
      products: [],
      total: 0,
      limit: 10,
      skip: 0,
    };
    const mockedKyGetAction = jest.fn().mockReturnValue({
      json: jest.fn().mockResolvedValue({
        products: [],
        total: 0,
        limit: 10,
        skip: 0,
      }),
    });
    mockedKyServer.mockResolvedValue({
      get: mockedKyGetAction,
    });

    const data = await getListProduct();
    // expect the data = mockedResponse
    expect(data).toEqual(mockedResponse);
    // mockedKyGetAction should have first params is 'products'
    // and second params is searchParams with limit = 10 and skip = 0
    expect(mockedKyGetAction).toHaveBeenNthCalledWith(1, "products", {
      searchParams: { limit: 10, skip: 0 },
    });
  });

  // should fallback to default searchParams if queryOptions is invalid
  it("should fallback to default searchParams if queryOptions is invalid", async () => {
    const mockedResponse = {
      products: [],
      total: 0,
      limit: 10,
      skip: 0,
    };
    const mockedKyGetAction = jest.fn().mockReturnValue({
      json: jest.fn().mockResolvedValue({
        products: [],
        total: 0,
        limit: 10,
        skip: 0,
      }),
    });
    mockedKyServer.mockResolvedValue({
      get: mockedKyGetAction,
    });

    const data = await getListProduct({ page: 0, limit: 0 });
    // expect the data = mockedResponse
    expect(data).toEqual(mockedResponse);
    // mockedKyGetAction should have first params is 'products'
    // and second params is searchParams with limit = 10 and skip = 0
    expect(mockedKyGetAction).toHaveBeenNthCalledWith(1, "products", {
      searchParams: { limit: 10, skip: 0 },
    });
  });

  // should query with the same passed queryOptions
  it("should query with the same passed queryOptions", async () => {
    const mockedResponse = {
      products: [],
      total: 0,
      limit: 10,
      skip: 0,
    };
    const mockedKyGetAction = jest.fn().mockReturnValue({
      json: jest.fn().mockResolvedValue({
        products: [],
        total: 0,
        limit: 10,
        skip: 0,
      }),
    });
    mockedKyServer.mockResolvedValue({
      get: mockedKyGetAction,
    });

    const data = await getListProduct({ page: 2, limit: 20 });
    // expect the data = mockedResponse
    expect(data).toEqual(mockedResponse);
    // mockedKyGetAction should have first params is 'products'
    // and second params is searchParams with limit = 20 and skip = 20
    expect(mockedKyGetAction).toHaveBeenNthCalledWith(1, "products", {
      searchParams: { limit: 20, skip: 20 },
    });
  });
});

describe("[API - /products/:id] Product Detail", () => {
  let mockedKyServer: jest.Mock;

  beforeEach(async () => {
    const { default: getKyServer } = await import("~/libs/ky/ky.server");
    mockedKyServer = getKyServer as jest.Mock;
  });

  // should query with the same passed id
  it("should query with the same passed id", async () => {
    const mockedResponse = {
      id: "1",
      name: "Product 1",
      description: "Description of product 1",
      price: 100,
      stock: 10,
    };
    const mockedKyGetAction = jest.fn().mockImplementation((url: string) => {
      // return json(null) if productId is not '1'
      if (url !== "products/1") {
        return { json: jest.fn().mockResolvedValue(null) };
      }
      return {
        json: jest.fn().mockResolvedValue(mockedResponse),
      };
    });
    mockedKyServer.mockResolvedValue({
      get: mockedKyGetAction,
    });

    const data = await getProductDetail("1");
    // expect the data = mockedResponse
    expect(data).toEqual(mockedResponse);
    // mockedKyGetAction should have first params is 'products/1'
    expect(mockedKyGetAction).toHaveBeenNthCalledWith(1, "products/1");
  });
});
