import request from "request";

export function login(): Promise<string[]> {
    return new Promise((resolve, reject) => {
        console.log('Logging in...')
        request.post(
            {
                url: 'https://my.rhinofit.ca/', formData: {
                    email: process.env.EMAIL,
                    password: process.env.PASSWORD,
                    rememberme: 'on'
                }
            },
            (err, httpResponse) => {
                if (err) {
                    return reject(err);
                }
                const cookies = httpResponse.headers['set-cookie'] || [];
                console.log(`Found ${cookies.length} cookies`)
                return resolve(cookies);
            }
        );
    });
}
