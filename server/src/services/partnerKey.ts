import { v4 as uuidv4 } from 'uuid';
import { addSeconds } from 'date-fns';
import prisma from '../prisma';
import config from '../config';
import * as audit from './audit';
import { AuditAction } from '@prisma/client';

export const getValidPartnerKeyByValue = async (value: string) => {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const partnerKey = await prisma.partnerKey.findFirst({
      where: { value, revokedAt: null, expiresAt: { gte: startOfToday } },
      include: { partner: true },
    });
    return partnerKey;
  } catch (error) {
    throw error;
  }
};

export const findPartnerKeys = async (partnerId: number) => {
  try {
    const partnerKeys = await prisma.partnerKey.findMany({ where: { partnerId }, include: { partner: true } });
    return partnerKeys;
  } catch (error) {
    throw error;
  }
};

export const createPartnerKey = async (requestPartnerId: number, serviceProviderId: number | undefined = undefined) => {
  try {
    const value = uuidv4();
    const expiresAt = addSeconds(new Date(), config.PARTNER_TOKEN_DURATION_SECONDS);
    const partnerKey = await prisma.partnerKey.create({
      data: { partnerId: requestPartnerId, value, expiresAt, serviceProviderId },
    });
    await audit.insertAudit(AuditAction.PARTNER_TOKEN_GENERATED, partnerKey.value);
    return partnerKey;
  } catch (error) {
    throw error;
  }
};

export const getPartnerKey = async (partnerKeyId: number) => {
  try {
    const partnerKeys = await prisma.partnerKey.findFirst({ where: { id: partnerKeyId }, include: { partner: true } });
    return partnerKeys;
  } catch (error) {
    throw error;
  }
};

export const revokePartnerKey = async (partnerKeyId: number) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { partnerId, ...partnerKey } = await prisma.partnerKey.update({
      data: { revokedAt: new Date() },
      where: { id: partnerKeyId },
    });
    await audit.insertAudit(AuditAction.PARTNER_TOKEN_DELETED, partnerKey.value);
    return partnerKey;
  } catch (error) {
    throw error;
  }
};

export const getPartnerKeyUsage = async (partnerKeyId: number) => {
  try {
    const numberOfUsage = await prisma.audit.count({
      where: {
        action: AuditAction.PARTNER_TOKEN_USED,
        payload: '' + partnerKeyId,
      },
    });
    return numberOfUsage;
  } catch (error) {
    throw error;
  }
};
