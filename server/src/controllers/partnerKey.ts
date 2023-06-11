import { Response } from 'express';
import StatusCodes from 'http-status-codes';
import { ZodError } from 'zod';
import { RequestWithUserInfo } from '../types';
import * as services from '../services';
import * as validators from './validators/partnerKey';
import logger from '../logger';

export const find = async (req: RequestWithUserInfo, res: Response): Promise<void | Response> => {
  try {
    let partnerId = req.user.partner?.id;
    if (!partnerId) {
      const { params } = validators.find(req);
      partnerId = params.partnerId;
    }

    const partnerKeys = await services.partnerKey.findPartnerKeys(partnerId);
    const allowedData = partnerKeys.filter((partnerKey) => {
      return req.user.isAdmin || partnerKey.partner?.userId === req.user.id;
    });

    const mappedPartnerKey = [];
    for (let index = 0; index < allowedData.length; index++) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { partner, partnerId, ...partnerKey } = allowedData[index];
      const usage = await services.partnerKey.getPartnerKeyUsage(partnerKey.id);
      mappedPartnerKey.push({
        ...partnerKey,
        usage,
      });
    }

    return res.send(mappedPartnerKey);
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
    const partnerId = req.user.partner?.id;
    if (!partnerId) return res.status(StatusCodes.UNAUTHORIZED).send();
    const {
      body: { serviceProviderId },
    } = validators.create(req);

    const partnerKey = await services.partnerKey.createPartnerKey(partnerId, serviceProviderId);
    return res.send(partnerKey);
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(StatusCodes.BAD_REQUEST).send(err.errors);
    }
    logger.info(err);
    return res.status(StatusCodes.BAD_REQUEST).send();
  }
};

export const revoke = async (req: RequestWithUserInfo, res: Response): Promise<void | Response> => {
  try {
    const {
      params: { partnerKeyId },
    } = validators.revoke(req);

    const partnerKey = await services.partnerKey.getPartnerKey(partnerKeyId);
    const isBelongsToPartner = req.user.partner?.id === partnerKey?.partner.id;
    if (!req.user.isAdmin && !isBelongsToPartner) {
      return res.status(StatusCodes.FORBIDDEN).send();
    }

    const revokedPartnerKey = await services.partnerKey.revokePartnerKey(partnerKeyId);
    if (!revokedPartnerKey) {
      return res.status(StatusCodes.NOT_FOUND).send();
    }
    return res.send(revokedPartnerKey);
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(StatusCodes.BAD_REQUEST).send(err.errors);
    }
    logger.info(err);
    return res.status(StatusCodes.BAD_REQUEST).send();
  }
};
// TODO: VERIFY REVOKE
