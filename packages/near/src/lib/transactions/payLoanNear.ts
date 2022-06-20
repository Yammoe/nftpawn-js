import { TransactionResult } from '@nftpawn-js/core';
import BigNumber from 'bignumber.js';

import Transaction from './index';

export default class PayLoanNearTx extends Transaction {
  async run(
    payAmount: number,
    assetTokenId: string,
    assetContractAddress: string,
    currencyContractAddress: string,
    currencyDecimals: number,
    principal: number,
    rate: number,
    duration: number,
  ): Promise<TransactionResult> {
    try {
      const gas = await this.calculateGasFee();

      const amount =  new BigNumber(payAmount).multipliedBy(10 ** currencyDecimals).toString(10)

      const transactions = [
        this.txObject(
          this.lendingProgram,
          'pay_back_loan_by_near,',
          {
            nft_contract_id: assetContractAddress,
            token_id: assetTokenId,
          },
          amount,
          gas
        ),
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
