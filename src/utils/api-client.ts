interface CustomConfig {
  method?: "GET" | "POST";
}

async function client(endpoint: string, customConfig?: CustomConfig) {
  const config = {
    method: "GET",
    ...customConfig,
  };

  return window
    .fetch(`${process.env.REACT_APP_API_URL}/${endpoint}`, config)
    .then(async (response) => {
      const data = await response.json();
      if (response.ok) {
        return data;
      }
      return Promise.reject(data);
    });
}

export { client };
