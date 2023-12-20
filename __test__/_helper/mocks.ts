export const jestWaitFor = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const mockedCookies = (
  collection: Record<string, string> = {
    vi: "vi",
    en: "en",
  },
) => {
  const inMemoryCookies = { ...collection };
  return () => {
    return {
      get: (key: string) => {
        const value = inMemoryCookies[key];
        if (!value) {
          return undefined;
        }
        return {
          value,
          name: key,
        };
      },
      set: (key: string, value: string) => {
        inMemoryCookies[key] = value;
      },
    };
  };
};

export const mockSessionResult = () => ({
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
