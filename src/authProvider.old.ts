import { AuthProvider } from "react-admin";

export const authProvider: AuthProvider = {
  login: ({ username }) => {
    localStorage.setItem("username", username);
    return Promise.resolve();
  },
  logout: () => {
    localStorage.removeItem("username");
    return Promise.resolve();
  },
  checkError: () => Promise.resolve(),
  checkAuth: () =>
    localStorage.getItem("username") ? Promise.resolve() : Promise.reject(),
  getPermissions: () => Promise.reject("Unknown method"),
  getIdentity: () =>
    Promise.resolve({
      id: "user",
      fullName: "Kyle Toh",
      avatar:
        "https://secure.gravatar.com/avatar/854a899faca5065ac620006778d81271?size=800",
    }),
};
