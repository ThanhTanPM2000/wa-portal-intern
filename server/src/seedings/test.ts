import prisma from '../prisma';
import axios from 'axios';
import { findProvision } from '../modules/provision';
//
(async () => {
  try {
    const serviceProvider = await prisma.serviceProvider.findUnique({
      where: {
        name: 'KONVERSE',
      },
    });

    const { BASE_URL, appId, appKey }: KonverseOptions = serviceProvider?.options as KonverseOptions;
    console.log(appId, appKey);
    const headers = {
      'app-id': appId.trim(),
      'app-key': appKey.trim(),
      'Content-Type': 'application/json',
    };

    const data = {
      cc: '1',
      phone_number: '7325851638',
      method: 'sms',
      cert: 'CmUKIQitmO74rsTAAxIGZW50OndhIghLZXlSZXBseVCO0t6LBhpA3TaMcxP4/ua5PIY5Q2mTQNZQiT8DyF9k/xGNuYs4djjuUguv9wFRc49yMrr/K0fy9VrK7nlVgN5WAcF5xJFQCBIubUQ+6bj707vzWrWzn69vLJ1f5eNfzdiTlBIKTq08+pe0I+8EygN+Kmr7d9OnNQ==',
    };

    const res = await axios.post(BASE_URL, data, {
      headers,
    });

    console.log('running 1', res.data);

    const { account, meta } = res.data;
    if (!account || !meta) throw new Error('account or meta was null');

    console.log({ account, meta, serviceProvider });

    // services.phoneNumber.updateOrCreateAPhoneNumber()
    const phoneNumber = await prisma.phoneNumber.create({
      data: {
        accountId: 75,
        value: '+1 732-585-1638',
      },
    });

    if (!serviceProvider?.id) throw new Error('Id provider not found');

    const { vname: name } = account[0];
    const provisionServer = await prisma.provisionServer.create({
      data: {
        name,
        options: {
          meta,
        },
        serviceProviderId: serviceProvider.id,
        phoneNumberId: phoneNumber.id,
      },
    });
    console.log('my Provision server', { ...provisionServer });
  } catch (error) {
    console.log(error.message);
    console.log(error.response.data);
  } finally {
    process.exit();
  }
})();
