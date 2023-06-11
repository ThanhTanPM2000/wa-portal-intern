import axios from 'axios';
import logger from './logger';

const url = 'https://CPaaS.konverse.ai/whatsapp/v1/account';

export const createProvisionServer = async (
  countryCode: string,
  phoneNumber: string | null,
  cert: string,
  pin: string,
) => {
  try {
    const data = {
      cc: '1',
      phone_number: '4243226141',
      method: 'sms',
      cert: 'CmwKKAj3yeLwldv2AhIGZW50OndhIg9LZXlyZXBseSBEZW1vIDZQtamViwYaQPd2kUbKkadn8LaEEHsaUysgFAmmkSZwwGttmUw8BVwJ5zgKfS+8bjE8A5t5SrGrT/W9FVwoLhkAOhdDDPOFswgSLm1EPum4+9O781q1s5yuaSqXWOLkWMTYqO9ZCk6tPCtjyMLLhy7vDDToEUidIcM=',
    };
    const result = await axios.post(url, data, {
      headers: {
        'Content-Type': 'application/json',
        'app-id': 'b54927dc2d93441285d9e0bab18e6bca',
        'app-key': 'e4390a92-4df2-4a2c-8e06-0ba4fd1022fb',
      },
    });
    if (result.data.errors) throw new Error(result.data.errors[0].details);

    return result;
  } catch (error) {
    logger.error(`${error}`);
    throw error;
  }
};
