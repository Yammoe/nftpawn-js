import { TransactionResult } from '@nftpawn-js/core';
import Transaction from './index';

export default class AcceptOfferTx extends Transaction {
  async run(
    assetTokenId: string,
    assetContractAddress: string,
    offerId: number,
  ): Promise<TransactionResult> {
    try {
      const gas = await this.calculateGasFee();

      const transactions = [
        {
          receiverId: this.lendingProgram,
          actions: [
            {
              type: 'FunctionCall',
              params: {
                methodName: "accept_offer",
                args: {
                  nft_contract_id: assetContractAddress,
                  token_id: assetTokenId,
                  offer_id: offerId,
                },
                gas,
                deposit: 1,
              },
            }
          ]
        },
      ];

      const wallet = await this.walletSelector.wallet()
      const res = await wallet.signAndSendTransactions({ 
        transactions,
        callbackUrl: this.generateCallbackUrl({ token_id: assetTokenId, contract_address: assetContractAddress }),
      });
      
      return this.handleSuccess(
        { txHash: res ? res[0].transaction.hash : '' } as TransactionResult,
        assetContractAddress,
        assetTokenId,
      );
    } catch (err) {
      return this.handleError(err);
    }
  }
}
