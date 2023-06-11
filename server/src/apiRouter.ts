import { Router } from 'express';
import requiresAdmin from './middleware/requiresAdmin';
import {
  auth,
  audit,
  user,
  health,
  account,
  partner,
  phoneNumber,
  partnerKey,
  manager,
  analytics,
  migration,
  provisionServer,
  serviceProvider,
} from './controllers';
import requiresPartner from './middleware/requiresPartner';

const apiRouter = (): Router => {
  const router = Router();

  router.get('/health', health.check);

  router.post('/login', auth.login);
  router.post('/logout', auth.logout);

  router.get('/me', user.me);
  router.get('/user', requiresPartner, user.find);
  router.get('/user/customerId', requiresPartner, user.getCustomerId);
  router.get('/user/initiate', user.initiateOnboardingProcess);
  router.post('/user/customerInitiate', user.initiateOnboardingProcessByCustomer);
  router.get('/user/:userId', user.get);
  router.put('/user/:userId', user.update);

  router.get('/partner', requiresAdmin, partner.find);
  router.get('/partner/getPartnerApiUsage', requiresAdmin, partner.getPartnerApiUsage);
  router.post('/partner', requiresAdmin, partner.create);
  router.get('/partner/getApiKey', requiresPartner, partner.getApiKey);
  router.get('/partner/serviceProviders', requiresPartner, partner.getAvailableServiceProviders);
  router.put('/partner/deactivateApiKey', requiresPartner, partner.deactivateApiKey);
  router.post('/partner/generateApiKey', requiresPartner, partner.generateApiKey);
  router.get('/partner/:partnerId', partner.get);
  router.put('/partner/:partnerId', requiresAdmin, partner.update);
  router.patch('/partner/:partnerId/changeActivation', requiresAdmin, partner.changeActivation);

  router.get('/account', account.find);
  router.get('/account/export', account.getExportingAccounts);
  router.get('/account/:accountId', account.get);
  router.post('/account/userCanceledFacebookFlow', account.userCanceledFacebookFlow);
  router.post('/account/userWithCustomerIdCanceledFacebookFlow', account.userWithCustomerIdCanceledFacebookFlow);
  router.post('/account/connectWithCustomerId', account.connectWithCustomerId);
  router.post('/account/connect', account.connect);
  router.put('/account/:wabaId/reload', requiresPartner, account.reload);
  router.delete('/account/:accountId', requiresAdmin, account.remove);

  router.get('/account/:accountId/phone-number', phoneNumber.find);

  router.get('/phone-number', phoneNumber.find);
  router.get('/phone-number/:phoneNumberId/cert', phoneNumber.getPhoneCert);

  router.get('/partner-key', partnerKey.find);
  router.post('/partner-key', partnerKey.create);
  router.put('/partner-key/:partnerKeyId/revoke', partnerKey.revoke);

  router.get('/manager', requiresAdmin, manager.find);
  router.get('/partner/:partnerId/manager', manager.partnerFind);
  router.get('/user/:userId/manager', manager.userFind);
  // router.get('/manager/:managerId', manager.get);
  // router.put('/manager/:managerId',requiresAdmin, manager.update); // need to change partner in future, done manually by admin after month of confirm
  router.put('/manager/:managerId/enable-credit-line', requiresPartner, manager.enableCreditLine); // need to change partner in future, done manually by admin after month of confirm
  router.put('/manager/:managerId/disable-credit-line', requiresPartner, manager.disableCreditLine); // need to change partner in future, done manually by admin after month of confirm

  router.get('/usage', analytics.getAnalyticOfClients);
  router.get('/audits', requiresAdmin, audit.find);

  router.get('/migration/waba', migration.getWabaIdByPhone);
  router.post('/migration/init', migration.initiatePhoneMigration);
  router.post('/migration/requestOTP', migration.requestOTP);
  router.post('/migration/verifyCode', migration.verifyCode);
  router.post('/migration/upload', requiresAdmin, migration.uploadMigrationList);
  router.get('/migration/', requiresPartner, migration.find);

  router.post('/provisionServer/:wabaId', provisionServer.create);

  // router.use('/serviceProvider', requiresAdmin)
  //   .get('', serviceProvider.find)
  //   .post('', serviceProvider.create)kjkj
  //   .patch('/:serviceProviderId/assignPartners', serviceProvider.assignPartners)
  //   .delete('', serviceProvider.remove);

  router.get('/serviceProvider', requiresAdmin, serviceProvider.find);
  router.post('/serviceProvider', requiresAdmin, serviceProvider.create);
  router.patch('/serviceProvider/:serviceProviderId', requiresAdmin, serviceProvider.updateSetting);
  router.patch('/serviceProvider/:serviceProviderId/assignPartners', requiresAdmin, serviceProvider.assignPartners);
  router.delete('/serviceProvider/:serviceProviderId', requiresAdmin, serviceProvider.remove);
  return router;
};

export default apiRouter;
