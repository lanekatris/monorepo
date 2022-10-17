import request from "request";

export function login(): Promise<string[]> {
  const email = process.env["RHINOFIT_EMAIL"];
  const password = process.env["RHINOFIT_PASSWORD"];

  if (!email || !password)
    throw new Error("email and password must be defined");

  return new Promise((resolve, reject) => {
    request.post(
      {
        url: "https://my.rhinofit.ca/",
        formData: {
          email,
          password,
          rememberme: "on",
        },
      },
      async (err, httpResponse) => {
        if (err) {
          return reject(err);
        }
        const newCookies = httpResponse.headers["set-cookie"];
        // await this.cacheManager.set("cookies", newCookies);
        return resolve(newCookies!);
      }
    );
  });
}
