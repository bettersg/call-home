import { AllowlistEntry as AllowlistEntryEntity, UserTypes } from '../models';
import { shouldEnableAllowlistSms } from './Feature';
import { sanitizeDbErrors } from './lib';
import type { TwilioClient as TwilioClientService } from './index';

const NEW_ALLOWLIST_SMS_MESSAGE = `
আপনি এখন আপনার প্রিয় মানুষকে বিনামূল্যে কল করতে পারেন!
এই সুবিধাটি পেতে হলে তে সাইন আপ করতে হবে।: https://app.callhome.sg/
`;

function AllowlistEntryService(
  AllowlistEntryModel: typeof AllowlistEntryEntity,
  TwilioClient: typeof TwilioClientService
) {
  async function getAllowlistEntryByPhoneNumber(phoneNumber: string) {
    return AllowlistEntryModel.findOne({
      where: {
        phoneNumber,
      },
    });
  }

  async function listAllowlistEntries() {
    return AllowlistEntryModel.findAll();
  }

  async function createAllowlistEntry({
    phoneNumber,
    destinationCountry,
  }: Partial<AllowlistEntryEntity>) {
    const newAllowlistEntry = await sanitizeDbErrors(() =>
      AllowlistEntryModel.create({
        role: UserTypes.USER,
        phoneNumber,
        destinationCountry,
      })
    );

    if (shouldEnableAllowlistSms()) {
      await TwilioClient.sendSms(phoneNumber, NEW_ALLOWLIST_SMS_MESSAGE);
    }
    return newAllowlistEntry;
  }

  async function deleteAllowlistEntry(id: number) {
    const allowlistEntry = await AllowlistEntryModel.findOne({
      where: {
        id,
      },
    });
    await allowlistEntry.destroy();
  }

  return {
    getAllowlistEntryByPhoneNumber,
    listAllowlistEntries,
    createAllowlistEntry,
    deleteAllowlistEntry,
  };
}

export default AllowlistEntryService;
