import { TransactionResult } from '@nftpawn-js/core';
import Transaction from './index';

export default class LiquidateLoanTx extends Transaction {
  async run(
    assetTokenId: string,
    assetContractAddress: string,
  ): Promise<TransactionResult> {
    try {
      const gas = await this.calculateGasFee();

      const transactions = [
        this.txObject(
          this.lendingProgram,
          'liquidate_overdue_loan',
          {
            nft_contract_id: assetContractAddress,
            token_id: assetTokenId
          },
          1,
          gas
        )
      ];

      const wallet = await this.walletSelector.wallet()
      const res = await wallet.signAndSendTransactions({ 
        transactions,
        callbackUrl: this.callbackUrl || this.generateCallbackUrl({ token_id: assetTokenId, contract_address: assetContractAddress }),
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
