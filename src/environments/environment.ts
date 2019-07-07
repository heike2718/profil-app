// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  version: '1.0.0',
  envName: 'Development',
  apiUrl: 'http://localhost:9000/authprovider',
  authUrl: 'http://localhost:4300',
  assetsUrl: 'assets',
  clientId: 'T73pF0WTZLuFTv0nbXgqIiXAxyl935c4WCBNwq32uvfQ',
  signupRedirectUrl: 'http://localhost:4200',
  loginRedirectUrl: 'http://localhost:4200#/profil'
};
