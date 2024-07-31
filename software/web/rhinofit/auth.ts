const request = require('request');

interface LoginRequest {
  email: string;
  password: string;
}

export interface Credentials {
  cookies: string[];
}

export function login(input: LoginRequest): Promise<Credentials> {
  const { email, password } = input;

  const formData = {
    email,
    password,
    rememberme: 'on',
  };

  return new Promise((resolve, reject) => {
    request.post(
      { url: 'https://my.rhinofit.ca/', formData },
      (err: Error, httpResponse: any) => {
        if (err) {
          return reject(err);
        }
        const cookies = httpResponse.headers['set-cookie'];
        if (!cookies) {
          return reject('Login failed');
        }
        return resolve({ cookies });
      }
    );
  });
}
