
// Simple error handling for API responses
export async function checkStatus(response) {
  if (!response) return;

  const { status } = response;

  if (status === 200) {
    return await response.json();
  } else {
    throw new Error(`HTTP error! status: ${status}`);
  }
}

export async function requestPortal(url, options) {
  const actualOptions = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "X-Tenant": "Tenant",
      "X-Client": "Client",
      ...options.headers, // Merge custom headers from options
    },
  };
  return fetch(url, actualOptions).then(checkStatus);
}