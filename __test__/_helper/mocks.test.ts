/**
 * this test file is used to test the helper functions
 */
describe("[helper] mocks", () => {
  let mockedCookies: ReturnType<typeof import("./mocks").mockedCookies>;

  beforeEach(async () => {
    // import the mockedCookies function
    const { mockedCookies: _mockedCookies } = await import("./mocks");
    // call the mockedCookies function
    mockedCookies = _mockedCookies();
  });

  // test the `mockedCookies` function
  it("[mockedCookies] should have default collection with [vi] and [en]", async () => {
    // get the [vi] cookie
    const viCookie = mockedCookies().get("vi");
    // get the [en] cookie
    const enCookie = mockedCookies().get("en");
    // assert the [vi] cookie is not undefined
    expect(viCookie).not.toBeUndefined();
    // assert the [en] cookie is not undefined
    expect(enCookie).not.toBeUndefined();
    // assert the [vi] cookie value is [vi]
    expect(viCookie?.value).toBe("vi");
    // assert the [en] cookie value is [en]
    expect(enCookie?.value).toBe("en");
  });

  // [mockedCookies] should return undefined when the key is not in the collection
  it("[mockedCookies] should return undefined when the key is not in the collection", async () => {
    // get the [fr] cookie
    const frCookie = mockedCookies().get("fr");
    // assert the [fr] cookie is undefined
    expect(frCookie).toBeUndefined();
  });

  // [mockedCookies] should set the cookie value to the collection
  it("[mockedCookies] should set the cookie value to the collection", async () => {
    // set the [fr] cookie
    mockedCookies().set("fr", "fr");
    // get the [fr] cookie
    const frCookie = mockedCookies().get("fr");
    // assert the [fr] cookie is not undefined
    expect(frCookie).not.toBeUndefined();
    // assert the [fr] cookie value is [fr]
    expect(frCookie?.value).toBe("fr");
  });
});
