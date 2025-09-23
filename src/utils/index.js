
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
      Authorization: "Bearer ",
      "Content-Type": "application/json",
      "X-Role-Id": "Summa",
      "X-Tenant": "Summa",
      "X-Client": "Summa",
      "X-Org": "Summa",
      "X-Project": "Summa",
      "X-Org-based": "Summa",
      "X-user": "test",
      ...options.headers, // Merge custom headers from options
    },
  };
  return fetch(url, actualOptions).then(checkStatus);
}