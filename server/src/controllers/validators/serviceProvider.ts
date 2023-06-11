import { Request } from 'express';
import * as z from 'zod';

export const find = (req: Request) => {
  const schema = z.object({
    query: z.object({
      page: z
        .string()
        .transform((arg) => Number(arg))
        .refine((val) => !isNaN(val), { message: 'Page should be a number' })
        .optional(),
      size: z
        .string()
        .transform((arg) => Number(arg))
        .refine((val) => !isNaN(val), { message: 'Size should be a number' })
        .optional(),
      search: z.string().optional(),
    }),
  });
  return schema.parse(req);
};

export const create = (req: Request) => {
  const schema = z.object({
    body: z.object({
      name: z.string(),
      endpoint: z.string(),
    }),
  });
  return schema.parse(req);
};

export const remove = (req: Request) => {
  const schema = z.object({
    params: z.object({
      serviceProviderId: z
        .string()
        .transform((arg) => Number(arg))
        .refine((val) => !isNaN(val), { message: 'Service provider id should be a number' }),
    }),
  });
  return schema.parse(req);
};

export const updateSetting = (req: Request) => {
  const schema = z.object({
    params: z.object({
      serviceProviderId: z
        .string()
        .transform((arg) => Number(arg))
        .refine((val) => !isNaN(val), { message: 'Service provider id should be a number' }),
    }),
    body: z.object({
      options: z.object({
        BASE_URL: z.string(),
        appId: z.string().optional(),
        appKey: z.string().optional(),
      }),
    }),
  });
  return schema.parse(req);
};

export const assignPartners = (req: Request) => {
  const schema = z.object({
    body: z.object({
      partnerIds: z.array(
        z
          .string()
          .transform((arg) => Number(arg))
          .refine((val) => !isNaN(val), { message: 'Partner Id should be a number' }),
      ),
    }),
    params: z.object({
      serviceProviderId: z
        .string()
        .transform((arg) => Number(arg))
        .refine((val) => !isNaN(val), { message: 'Service provider id should be a number' }),
    }),
  });
  return schema.parse(req);
};
