import { AxiosResponse } from 'axios';
import { axios } from './axios';
import { ServiceProvider } from '../types';

type FindResponse = {
  serviceProviders: ServiceProvider[];
  total: number;
  selectedPage: number;
  selectedSize: number;
};

export const find = async (searchText = '', page = 1, size = 10) => {
  try {
    const response: AxiosResponse<FindResponse> = await axios.get(
      `/serviceProvider?page=${page}&size=${size}${searchText && '&search=' + searchText}`,
    );
    return response.data;
  } catch (error) {
    console.log(error.message);
    throw error;
  }
};

export const create = async (name: string, endpoint: string) => {
  try {
    const response = await axios.post(`/serviceProvider`, { name: name.toUpperCase(), endpoint });
    console.log('test');
    return response?.data;
  } catch (error) {
    console.log(error.message);
    throw error;
  }
};

export const setting = async (serviceProviderId: string, options: any) => {
  try {
    const response = await axios.patch(`serviceProvider/${serviceProviderId}`, {
      serviceProviderId,
      options,
    });
    return response.data;
  } catch (error) {
    console.log(error.message);
    throw error;
  }
};

export const update = async (serviceProviderId: string, partnerIds: string[]) => {
  try {
    const response: AxiosResponse<ServiceProvider> = await axios.patch(
      `/serviceProvider/${serviceProviderId}/assignPartners`,
      {
        partnerIds,
      },
    );
    return response.data;
  } catch (error) {
    console.log(error.message);
    throw error;
  }
};

export const remove = async (serviceProviderId: string) => {
  try {
    const response = await axios.delete(`/serviceProvider/${serviceProviderId}`);
    return response.data;
  } catch (error) {
    console.log(error.message);
    throw error;
  }
};
