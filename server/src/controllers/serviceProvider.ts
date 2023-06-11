import { Response } from 'express';
import StatusCodes from 'http-status-codes';
import { ZodError } from 'zod';
import { RequestWithUserInfo } from '../types';
import * as services from '../services';
import * as validators from './validators/serviceProvider';
import logger from '../logger';

export const find = async (req: RequestWithUserInfo, res: Response): Promise<void | Response> => {
  try {
    const {
      query: { search, page, size },
    } = validators.find(req);
    const {
      serviceProviders,
      total,
      page: selectedPage,
      size: selectedSize,
    } = await services.serviceProvider.findProviders(page, size, search);
    res.send({
      serviceProviders,
      total,
      selectedPage,
      selectedSize,
    });
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(StatusCodes.BAD_REQUEST).send(err.errors);
    }
    logger.info(err);
    return res.status(StatusCodes.BAD_REQUEST).send();
  }
};

export const create = async (req: RequestWithUserInfo, res: Response): Promise<void | Response> => {
  try {
    const {
      body: { name, endpoint },
    } = validators.create(req);
    const newProvider = await services.serviceProvider.createProvider(name, endpoint);
    res.send(newProvider);
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(StatusCodes.BAD_REQUEST).send(err.errors);
    }
    logger.info(err);
    return res.status(StatusCodes.BAD_REQUEST).send();
  }
};

export const remove = async (req: RequestWithUserInfo, res: Response): Promise<void | Response> => {
  try {
    const { params } = validators.remove(req);
    const { serviceProviderId } = params;
    const isRemove = await services.serviceProvider.removeProvider(serviceProviderId);

    return res.send(isRemove);
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(StatusCodes.BAD_REQUEST).send(err.errors);
    }
    logger.info(err);
    return res.status(StatusCodes.BAD_REQUEST).send();
  }
};

export const updateSetting = async (req: RequestWithUserInfo, res: Response): Promise<void | Response> => {
  try {
    const {
      params: { serviceProviderId },
      body: { options},
    } = validators.updateSetting(req);
    const updatedServiceProvider = await services.serviceProvider.updateProvider(serviceProviderId, options);
    return res.send(updatedServiceProvider);
  } catch (error) {}
};

export const assignPartners = async (req: RequestWithUserInfo, res: Response): Promise<void | Response> => {
  try {
    const {
      body: { partnerIds },
      params: { serviceProviderId },
    } = validators.assignPartners(req);
    const { email } = req.user;
    const updatedServiceProvider = await services.serviceProvider.assignPartnersToServiceProvider(
      email,
      serviceProviderId,
      partnerIds,
    );
    res.send(updatedServiceProvider);
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(StatusCodes.BAD_REQUEST).send(err.errors);
    }
    logger.info(err);
    return res.status(StatusCodes.BAD_REQUEST).send();
  }
};
