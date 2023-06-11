import prisma from '../prisma';
import { Prisma } from '@prisma/client';

export const findProviders = async (page = 1, size = 10, search = '') => {
  const serviceProviders = await prisma.serviceProvider.findMany({
    where: {
      name: {
        contains: search,
        mode: 'insensitive',
      },
    },
    include: {
      partners: true,
      provisionServers: true,
    },
    skip: (page - 1) * size,
    take: size,
  });

  const total = await prisma.serviceProvider.count({});

  return {
    total,
    page,
    size,
    serviceProviders,
  };
};

export const createProvider = async (name: string, endpoint: string) => {
  const existedServiceProvider = await prisma.serviceProvider.findFirst({
    where: {
      // OR: [{ name }, { endpoint }],
      name,
    },
  });

  console.log('hello');

  if (existedServiceProvider) throw new Error('Service Provider is already existed');

  const newServiceProvider = await prisma.serviceProvider.create({
    data: {
      name,
      options: {
        endpoint,
      },
      // endpoint,
    },
  });

  return newServiceProvider;
};

export const updateProvider = async (serviceProviderId: number, options: any) => {
  const updatedServiceProvider = await prisma.serviceProvider.update({
    where: {
      id: serviceProviderId,
    },
    data: {
      options,
    },
  });

  return updatedServiceProvider;
};

export const removeProvider = async (serviceProviderId: number) => {
  await prisma.serviceProvider.delete({
    where: {
      id: serviceProviderId,
    },
  });
  return true;
};

export const assignPartnersToServiceProvider = async (
  email: string,
  serviceProviderId: number,
  partnerIds: number[],
) => {
  const partners = await prisma.partner.findMany({
    where: {
      id: {
        in: partnerIds,
      },
    },
    include: {
      serviceProviders: true,
    },
  });

  await prisma.serviceProvidersOnPartners.deleteMany({
    where: {
      partnerId: {
        notIn: partners.map((partner) => partner.id),
      },
      serviceProviderId,
    },
  });

  const partnerIds_serviceProviderIds =
    partners &&
    (await Promise.all(
      partners
        // .filter(
        //   ({ serviceProviders }) =>
        //     serviceProviders.length !== 0 &&
        //     serviceProviders.findIndex((serviceProdivder) => serviceProdivder.serviceProviderId === serviceProviderId) ===
        //       -1,
        // )
        .map(({ id }) => ({
          where: {
            partnerId_serviceProviderId: {
              partnerId: id,
              serviceProviderId,
            },
          },
          create: {
            partnerId: id,
            assignedBy: email,
          },
        })),
    ));

  const updatedServiceProvider = await prisma.serviceProvider.update({
    where: {
      id: serviceProviderId,
    },
    data: {
      partners: {
        connectOrCreate: partnerIds_serviceProviderIds,
      },
    },
    include: {
      partners: true,
    },
  });

  return updatedServiceProvider;
};
