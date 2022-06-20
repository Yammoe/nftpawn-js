import { timestampAfter, TransactionResult } from '@nftpawn-js/core';
import BigNumber from 'bignumber.js';

import Transaction from './index';

export default class OrderNowNearTx extends Transaction {
  async run(
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
      const transactions = [];

      const amount = new BigNumber(principal).multipliedBy(10 ** currencyDecimals).toString(10)

      const msg = JSON.stringify({
        nft_contract_id: assetContractAddress,
        token_id: assetTokenId,
        action: 'offer_now',
        loan_principal_amount: amount,
        loan_duration: duration,
        loan_currency: currencyContractAddress,
        loan_interest_rate: new BigNumber(rate).multipliedBy(10000).toNumber(),
        available_at: timestampAfter(0),
      });
      
      transactions.push(
        this.txObject(
          this.lendingProgram,
          'offer_by_near,',
          { msg },
          amount,
          gas
        )
      );

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
