interface ProvisionBase {
  getProvisionName: () => string;
  spinUpServer: (...args: unknown[]) => Promise<string>;
  handleStatusUpdateWebhook: (...args: unknown[]) => Promise<void>;
}

type BaseOptions = {
  BASE_URL: string;
  PROVIDER_NAME: string;
};
