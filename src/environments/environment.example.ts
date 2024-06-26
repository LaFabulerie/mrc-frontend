export const environment = {
  production: true,
  serverHost: 'http://<BACKEND_IP_TO_COMPLETE>:8080',
  isStandalone: true, //if false, the app will run in web mode and apiKey must be set
  houseless: false, //can be set to true if this app is standalone
  isPrintable: true, //if true, the app will be able to print basket
  apiKey: null,
};
