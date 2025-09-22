import { checkStatus } from "./helper";
import { getStorage } from "../storages";
import { portalUrl, tokenKey } from "../config";

export async function requestPortal(url, options) {
  const token = await getStorage(tokenKey);
  const actualUrl = `${portalUrl}${url}`;
  const actualOptions = {
    ...options,
    headers: {
      Authorization: `${"Bearer" + " " + token}`,
      "Content-Type": "application/json",
    },
  };
  return fetch(actualUrl, actualOptions).then(checkStatus);
}

export async function requestExternal(url, options, path) {
  const actualUrl = `${portalUrl}${url}`;
  const actualOptions = {
    ...options,
    body: JSON.stringify(body),
    headers: {
      Authorization: `${"Bearer" + " " + token}`,
      "Content-Type": "application/json",
    },
  };
  return fetch(actualUrl, actualOptions).then(checkStatus);
}
