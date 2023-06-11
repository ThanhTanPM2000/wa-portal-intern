import Konverse from './konverse';

let konverse: ProvisionBase | null;
// Initialize each provider
(async () => {
  konverse = await Konverse();
})();

const findProvision = (serviceProviderName: string) => {
  switch (serviceProviderName.toUpperCase()) {
    case konverse?.getProvisionName():
      return konverse;
    default:
      break;
  }
};

export { findProvision };
