import { checkStatus, checkExternalStatus } from "./helper";
// import { getStorage } from "../storages";
import { portalUrl } from "../config";

export async function requestPortal(url, options) {
//   const token = await getStorage(tokenKey);'
  const actualUrl = `${portalUrl}${url}`;
  const actualOptions = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "X-Role-Id": "Role",
      "X-Tenant": "Tenant",
      "X-Client": "Client",
    },
  };
  return fetch(actualUrl, actualOptions).then(checkStatus);
}

export async function requestExternal(url, options) {
  const actualUrl = `${portalUrl}${url}`;
  const actualOptions = {
    ...options,
    body: JSON.stringify(options.body),
    headers: {
      "Content-Type": "application/json",
      "X-Tenant": "Tenant",
      "X-Client": "Client",
    },
  };
  return fetch(actualUrl, actualOptions).then(checkStatus);
}

export async function requestExternalAPI(url, options) {
  console.log('Making external API request to:', url);
  
  const actualOptions = {
    method: 'post',
    body: JSON.stringify(options.body),
    headers: {
      "Content-Type": "application/json",
      "X-Tenant": "Tenant",
      "X-Client": "Client",
       ...options.headers
    },
  };
  
  try {
    console.log('Request options:', actualOptions);
    const response = await fetch(url, actualOptions);
    console.log('Response received:', response.status, response.statusText);
    return await checkExternalStatus(response);
  } catch (error) {
    console.error('External API request failed:', error);
    console.error('URL:', url);
    console.error('Options:', actualOptions);
    throw error;
  }
}
