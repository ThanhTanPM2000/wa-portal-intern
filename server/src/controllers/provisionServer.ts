import { Request, Response } from 'express';
import StatusCodes from 'http-status-codes';

import logger from '../logger';
import * as services from '../services';
import * as validators from './validators/provisionServer';

export const create = async (req: Request, res: Response): Promise<void | Response> => {
  try {
    const { params } = validators.create(req);
    const { wabaId } = params;
    const result = await services.provisionServer.create(wabaId);
    return res.send(result);
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).send(error.message);
  }
};
