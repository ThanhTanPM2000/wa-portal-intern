import { phoneNumber } from '../services';

import * as provisionServer from '../provisionServer';
import logger from '../logger';

export const create = async (wabaId: string) => {
  try {
    const phoneNumbers = await phoneNumber.getAllPhoneNumbersOfWaba(undefined, wabaId);
    const result = [];
    for (const num of phoneNumbers) {
      const phoneCert = await phoneNumber.getPhoneCert(wabaId);
      if (!phoneCert) {
        logger.error(`Cannot get phone cert of phonenumber ${num.value}`);
        continue;
      }

      const trimmedNumber = num.value.trim();
      const phoneParts = trimmedNumber.split(' ');
      const cc = phoneParts[0].replace('+', '');
      const pin = Math.random().toString().split('.')[1].substring(0, 6);

      const data = await provisionServer.createProvisionServer(cc, num.shortenValue, phoneCert.certificate, pin);
      result.push(data);
    }
    return result;
  } catch (error) {
    throw error;
  }
};
