export const utils = {
  api: import.meta.env.VITE_API_URL,

  options: {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "kcb-api-key": import.meta.env.VITE_API_KEY,
      Accept: "*/*",
      "Access-Control-Allow-Origin": "*",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  },
};
