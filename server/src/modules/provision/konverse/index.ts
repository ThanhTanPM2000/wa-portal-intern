import prisma from '../../../prisma';
import * as services from '../../../services';
import axios from 'axios';

async function Konverse(): Promise<ProvisionBase | null> {
  const PROVIDER_NAME = 'KONVERSE';
  let serviceProvider = await prisma.serviceProvider.findUnique({ where: { name: PROVIDER_NAME } });
  if (!serviceProvider) {
    serviceProvider = await prisma.serviceProvider.create({
      data: {
        name: PROVIDER_NAME,
        options: {
          BASE_URL: '',
          appId: '',
          appKey: '',
        } as KonverseOptions,
      },
    });
  }
  const { BASE_URL, appId, appKey }: KonverseOptions = serviceProvider?.options as KonverseOptions;

  const getProvisionName = () => PROVIDER_NAME;

  const spinUpServer = async (phoneNumberId: number, serviceProviderId: number) => {
    try {
      const phoneNumber = await prisma.phoneNumber.findUnique({
        where: { id: phoneNumberId },
        include: { account: true },
      });
      if (!phoneNumber) {
        throw new Error(`Cannot find phone number ${phoneNumberId}`);
      }

      const phoneCert = await services.phoneNumber.getPhoneCert(phoneNumber.phoneNumberId as string);
      if (!phoneCert) throw new Error(`Cannot find cert of phone number ${phoneNumber.value}`);

      const headers = {
        'app-id': appId.trim(),
        'app-key': appKey.trim(),
        'Content-Type': 'application/json',
      };

      const trimmedNumber = phoneNumber.value.trim();
      const firstSpaceIndex = trimmedNumber.indexOf(' ');
      const countryCodePart = trimmedNumber.substring(0, firstSpaceIndex);
      const cc = countryCodePart.replace('+', '');
      const phoneValue = trimmedNumber.substring(firstSpaceIndex + 1).replace(/\D/g, '');

      const data = {
        cc,
        phone_number: phoneValue,
        method: 'sms',
        cert: phoneCert,
      };

      // {
      // account: [ { vname: 'KeyReply' } ],
      // meta: { api_status: 'stable', version: '2.35.4' }
      // }
      const res = await axios.post(BASE_URL, data, {
        headers,
      });

      const { account, meta } = res.data;
      if (!account || !meta) throw new Error();

      const { vname: name } = account[0];
      await prisma.provisionServer.create({
        data: {
          name,
          options: {
            meta,
          },
          serviceProviderId,
          phoneNumberId,
        },
      });
      return name;
    } catch (error) {
      return 'hello';
    }
  };

  const handleStatusUpdateWebhook = async (phoneNumberId: number, dataWebHook: any) => {
    const provisionServer = await prisma.provisionServer.findFirst({
      where: {
        phoneNumberId,
        name: PROVIDER_NAME,
      },
    });

    if (!provisionServer) return;

    await prisma.provisionServer.update({
      where: {
        id: provisionServer.id,
      },
      data: {
        options: { ...JSON.parse(`${provisionServer.options}`), dataWebHook },
      },
    });

    return;
  };

  return {
    getProvisionName,
    spinUpServer,
    handleStatusUpdateWebhook,
  };
}

export default Konverse;
