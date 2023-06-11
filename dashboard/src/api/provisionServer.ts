import { axios } from './axios';

/**
 * Uses cookies to check if session still valid and user's self info
 * Useful for when user closes and opens the page
 */
const create = async (wabaId: string) => {
  try {
    const res = await axios.post(`/provisionServer/${wabaId}`);
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export { create };
