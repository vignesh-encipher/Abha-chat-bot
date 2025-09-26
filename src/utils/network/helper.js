const defaultHeaders = {
    "Content-Type": "application/json",
    // systemName: osName || "Unknown",
  };
  
  export const setHeaders = async () => {
    return { ...defaultHeaders };
  };
  
  export async function checkStatus(response) {
    const data = await response.json();
    if (data.logout) {
      await removeStorage(tokenKey);
      window.open("/", "_self");
      return;
    }
    if (response.status !== 200) {
      const error = {
        ...data,
      };
      throw error;
    }
    if (response.status === 401) {
      window.open("/login", "_self");
    }
    return data;
  }

  export async function checkExternalStatus(response) {
    if (!response.ok) {
      const error = {
        status: response.status,
        statusText: response.statusText,
        message: `HTTP error! status: ${response.status}`
      };
      throw error;
    }
    return response.json();
  }
  