export const utils = {
  api: import.meta.env.VITE_API_URL,

  /**
   * Getter ES6 — retourne un nouvel objet options à chaque accès.
   * Le token est lu dans localStorage au moment de l'appel, jamais à l'import.
   */
  get options() {
    return {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "kcb-api-key": import.meta.env.VITE_API_KEY,
        Accept: "*/*",
        "Access-Control-Allow-Origin": "*",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };
  },
};
