export interface RhinofitConfiguration {
  rhinofit: {
    email: string;
    password: string;
  };
}

export default () => {
  const environmentVariables = ['RHINOFIT_EMAIL', 'RHINOFIT_PASSWORD'];
  environmentVariables
    .filter((variable) => !process.env[variable])
    .forEach((variable) => {
      throw new Error(`Environment variable not found: ${variable}`);
    });
  const config: RhinofitConfiguration = {
    rhinofit: {
      email: process.env.RHINOFIT_EMAIL,
      password: process.env.RHINOFIT_PASSWORD,
    },
  };
  return config;
};
