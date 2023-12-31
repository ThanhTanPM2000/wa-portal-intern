export type WABAMigration = {
  id: number;
  ownerEmail: string;
  partnerEmail: string;
  existingWABAId: string;
  existingWABAName: string;
  newWABAId: string;
  newWABAName: string;
  businessManagerId: string;
  phoneNumbers: string[];
  businessVerificationStatus: string;
  WABAReviewStatus: string;
  twoFADisabled: boolean;
  krWABACreated: boolean;
  clientConfirm: boolean;
  readyForMigration: boolean;
  migrationInitiated: boolean;
  migrationConfirmed: boolean;
  createdAt: string;
  updatedAt: string;
};

export type InfoApiUsage = {
  partner: Partner;
  apiUsage: DataCache[];
};

export type Partner = {
  id: number;
  timezone: string;
  user?: User;
  isActivated: boolean;
};

export enum CreditLineState {
  SHARED,
  MANUALLY_REVOKED,
  AUTO_REVOKED,
  NONE,
}

export type User = {
  id: number;
  email: string;
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
  partner?: Partner;
  status: string;
  uplineEmail: string;
};

export enum UserStatusEnum {
  NotInitiated = 'NotInitiated',
  Initiated = 'Initiated',
  Completed = 'Completed',
}

export type Account = {
  id: number;
  timezone: string;
  userId: number;
  wabaId: string;
  name: string;
  businessName: string;
  businessId: string;
  currency: string;
  status: string;
  createdAt: string;
  phoneNumbers: PhoneNumber[];
  ownerEmail: string;
  manager?: Manager;
};

export type Manager = {
  id: number;
  partnerId?: number;
  partner?: Partner;
  creditLineAllocationConfigId: null | string;
  creditLineState: CreditLineState;
  partnerKey?: PartnerKey;
};

export type PhoneNumber = {
  id: number;
  accountId: number;
  value: string;
  certAvailableAt: string;
  certLastCheckedAt: string;
  createdAt: string;
  limit: string;
  updatedAt: string;
  nameStatus: string;
  qualityRating: string;
  verifiedName: string;
  phoneNumberId: string;
  status: string;
  provisionServer?: ProvisionServer;
};

export type Me = {
  email: string;
  id: number;
  isAdmin: boolean;
  partnerId: number;
  status: string;
};

export type PartnerKey = {
  id: number;
  value: string;
  createdAt: string;
  expiresAt: string;
  revokedAt: string;
  usedAt: string;
  usage: number;
  serviceProvider?: ServiceProvider;
};

export type Usage = {
  wabaId: string;
  phoneNumbers: {
    id: number;
    accountId: number;
    value: string;
    certLastCheckedAt: string;
    certAvailableAt: string;
    createdAt: string;
    updatedAt: string;
  }[];
  email: string;
  sentMessagesCount: number;
  deliveredMessagesCount: number;
  wabaName: string;
  dividedMessagesEachDates: {
    date: number;
    sent: number;
    delivered: number;
  }[];
};

export type Audit = {
  id: number;
  action: string;
  payload: string;
  timestamp: string;
};

export type PhoneCertInfo = Pick<PhoneNumber, 'id' | 'value'>;

export type ApiKey = {
  isActive: boolean;
  value: string;
};

export type ServiceProvidersOnPartners = {
  partner: Partner;
  partnerId: number;
  serviceProvider: ServiceProvider;
  serviceProviderId: number;
  assignedAt: Date;
  assignedBy: string;
};

export type ServiceProvider = {
  id: number;
  name: string;
  options: any;
  partners: ServiceProvidersOnPartners[];
  createdAt: Date;
  updateAt: Date;
  partnerKeys: PartnerKey;
  provisionServers: ProvisionServer;
};

export type ProvisionServer = {
  id: number;
  name: string;
  options: any;
  serviceProviderId: number;
  phoneNumberId: number;
  serviceProvider: ServiceProvider;
  phoneNumber: PhoneNumber;
};

export type DataCache = {
  key: string;
  total: string;
};
