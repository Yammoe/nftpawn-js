import { timestampAfter, TransactionResult } from '@nftpawn-js/core';
import BigNumber from 'bignumber.js';

import Transaction from './index';

export default class PayLoanTx extends Transaction {
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

      const msg = JSON.stringify({
        nft_contract_id: assetContractAddress,
        token_id: assetTokenId,
        action: 'pay_back_loan',
        loan_principal_amount: new BigNumber(principal).multipliedBy(10 ** currencyDecimals).toString(10),
        loan_duration: duration,
        loan_currency: currencyContractAddress,
        loan_interest_rate: new BigNumber(rate).multipliedBy(10000).toNumber(),
        available_at: timestampAfter(0),
      });

      const transactions = [
          this.txObject(
          currencyContractAddress,
          'ft_transfer_call',
          {
            receiver_id: this.lendingProgram,
            amount: new BigNumber(payAmount).multipliedBy(10 ** currencyDecimals).toString(10),
            msg,
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
