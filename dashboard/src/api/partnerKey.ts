import { AxiosResponse } from 'axios';
import { axios } from './axios';
import { PartnerKey } from '../types';

const find = async () => {
  try {
    const response: AxiosResponse<PartnerKey[]> = await axios.get(`/partner-key`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

const create = async (serviceProviderId: number | null = null) => {
  try {
    const response: AxiosResponse<PartnerKey> = await axios.post(`/partner-key`, {
      serviceProviderId: serviceProviderId?.toString(),
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

const revoke = async (partnerKeyId: number) => {
  try {
    const response: AxiosResponse<PartnerKey> = await axios.put(`/partner-key/${partnerKeyId}/revoke`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export { create, find, revoke };
