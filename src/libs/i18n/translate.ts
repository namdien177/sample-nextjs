import { type Dictionary } from "~/libs/i18n/dictionary";

const getTranslation = (key: string, dictionary?: Dictionary): string => {
  let translateToken = key;
  // check if the provided key has dot notation. Then it's a nested key.

  if (key.indexOf(".") > -1) {
    const posDot = key.indexOf(".");

    // get the first part of the key for translateToken
    translateToken = key.substring(0, posDot);
    // rest of the key
    const restKey = key.substring(posDot + 1);
    return getTranslation(restKey, dictionary?.[translateToken] as Dictionary);
  }

  if (!dictionary) {
    throw new Error("No dictionary provided");
  }

  const translation = dictionary[translateToken];
  if (translation === undefined) {
    throw new Error(`No translation found for key ${translateToken}`);
  }

  if (typeof translation === "object") {
    throw new Error(`Translation for key ${translateToken} is not a string`);
  }

  return translation;
};

/**
 * Translate a key to a string.
 * @param key
 * @param dictionary
 * @param params
 */
const t = (
  key: string,
  dictionary: Dictionary | undefined,
  params?: Record<string, string | number>,
): string => {
  if (!dictionary) {
    return key;
  }

  try {
    let result = getTranslation(key, dictionary);
    // check have params in the result, with the pattern of {{param}}, then replace it accordingly.
    // if there is a param in the result, but not in the params, then throw error.
    if (params) {
      const regex = /\{\{(.*?)}}/g;
      const matches = result.match(regex);
      if (matches && matches.length > 0) {
        matches.forEach((match) => {
          const key = match.replace(/^\{\{/, "").replace(/}}$/, "");
          if (params[key] === undefined) {
            throw new Error(`Missing param ${key} for key ${key}`);
          }
          result = result.replace(match, params[key] as string);
        });
      }
    }
    return result;
  } catch (error) {
    console.error(error);
    return key;
  }
};

export default t;
