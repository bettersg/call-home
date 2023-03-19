export interface AppConfig {
  personalCallsUrl: string;
}

const AppConfig: AppConfig = {
  personalCallsUrl: 'https://app.callhome.sg',
};

export function getAppConfig() {
  return AppConfig;
}
