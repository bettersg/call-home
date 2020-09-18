import type { Wallet as WalletEntity } from '../models';

function WalletService(WalletModel: typeof WalletEntity) {
  async function createWalletForUser(userId: number) {
    const currentWallet = await WalletModel.findOne({
      where: {
        userId,
      },
    });
    if (currentWallet) {
      return currentWallet;
    }
    return WalletModel.create({ userId });
  }

  async function getWalletForUser(userId: number) {
    return WalletModel.findOne({
      where: {
        userId,
      },
    });
  }

  async function processTransaction(userId: number, amount: number) {
    const wallet = await getWalletForUser(userId);
    await WalletModel.update(
      {
        callTime: wallet.callTime + amount,
      },
      {
        where: {
          userId,
        },
      }
    );
    return getWalletForUser(userId);
  }

  return {
    createWalletForUser,
    getWalletForUser,
    processTransaction,
  };
}

export default WalletService;
