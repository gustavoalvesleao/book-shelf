import * as auth from "auth-provider";

const apiURL = process.env.REACT_APP_API_URL;

interface CustomConfig {
  data?: unknown;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  token?: string;
  headers?: {
    "Content-Type"?: string;
    Authorization?: string;
  };
  abortController?: AbortController;
}

async function client(
  endpoint: string,
  {
    data,
    token,
    abortController,
    headers: customHeaders,
    ...customConfig
  }: CustomConfig = {}
) {
  const config = {
    method: data ? "POST" : "GET",
    body: data ? JSON.stringify(data) : undefined,
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": data ? "application/json" : "",
      ...customHeaders,
    },
    signal: abortController ? abortController.signal : undefined,
    ...customConfig,
  };

  return window
    .fetch(`${apiURL}/${endpoint}`, config)
    .then(async (response) => {
      if (response.status === 401) {
        await auth.logout();
        window.location.assign(window.location.pathname);
        return Promise.reject(Error("Please re-authenticate"));
      }
      const newData = await response.json();
      if (response.ok) {
        return newData;
      }
      return Promise.reject(newData);
    });
}

export { client };
