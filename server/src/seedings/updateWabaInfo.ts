import prisma from "../prisma";
import logger from "../logger";
import { fetchAndUpdateWabaInfo } from "../services/account";
import { fetchAndUpdatePhoneNumbers } from "../services/phoneNumber";

const updateWabaInfo = async (wabaId: string) => {
    try {
        logger.info("Update Waba Info");
        const account = await prisma.account.findFirst({
            where: {
                wabaId
            },
            include: {
                phoneNumber: true,
            }
        });
        if (!account) {
            logger.error(`Couldnt find WABA with id ${wabaId}`);
            return;
        }
        await fetchAndUpdateWabaInfo(account)
        await fetchAndUpdatePhoneNumbers(account)
        logger.info(`Updated waba info with id ${wabaId}`);
    } catch (error) {
        logger.error(error.message);
        return;
    }
    process.exit();
}

(async () => await updateWabaInfo(''))()