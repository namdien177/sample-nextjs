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

  // [jestWaitFor] should wait for the given time
  it("[jestWaitFor] should wait for the given time", async () => {
    // import the jestWaitFor function
    const { jestWaitFor } = await import("./mocks");
    // get the start time
    const startTime = Date.now();
    // wait for 1 second
    await jestWaitFor(1000);
    // get the end time
    const endTime = Date.now();
    // assert the time difference is greater than or equal to 1000
    expect(endTime - startTime).toBeGreaterThanOrEqual(1000);
  });
});
