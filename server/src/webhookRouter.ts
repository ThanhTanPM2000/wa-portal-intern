import { Router } from 'express';
import { webhook } from './controllers';

const webhookRouter = (): Router => {
  const router = Router();
  router.get('/', webhook.validateVerificationRequests);
  router.post('/', webhook.handleWebhookEvents);
  router.post('/:provider', webhook.handleServiceProviderUpdate);
  router.post('/webhook/:nameProvider', webhook.handleServiceProviderUpdate);
  return router;
};

export default webhookRouter;
