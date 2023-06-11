import { Account, Manager, Partner, PhoneNumber, User } from '@prisma/client';
import { Request } from 'express';

export type SanitizedUser = {
  id: number;
  email: string;
  isAdmin: boolean;
  partner: { id: number; timezone: string } | null;
  status: UserStatus;
};

export interface RequestWithUserInfo extends Request {
  user: SanitizedUser;
}

export type UserStatus = "NotInitiated" | "Initiated" | "Completed";

export enum UserStatusEnum {
  NotInitiated = "NotInitiated",
  Initiated = "Initiated",
  Completed = "Completed",
}

export const apiPaths = ['/api', '/api-docs', '/partnerApi', '/webhooks'];

export type AccountSearchResult = {
  accounts: (Account & {
    manager: (Manager & {
      partner: Partner | null;
    }) | null;
    phoneNumber: PhoneNumber[];
    user: User;
  })[];
  total: number;
  page: number;
  size: number;
}

export type AccountSearchItem = Account & {
  manager: (Manager & {
    partner: Partner | null;
  }) | null;
  phoneNumber: PhoneNumber[];
  user: User;
}