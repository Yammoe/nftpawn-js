import BigNumber from 'bignumber.js';
import { timestampAfter, TransactionResult } from '@nftpawn-js/core';

import Transaction from './index';
import { nearViewFunction } from '../utils';

export default class MakeOfferTx extends Transaction {
  async run(
    assetTokenId: string,
    assetContractAddress: string,
    currencyContractAddress: string,
    currencyDecimals: number,
    principal: number,
    rate: number,
    duration: number,
    availableIn: number,
  ): Promise<TransactionResult> {
    try {
      const gas = await this.calculateGasFee();
      const transactions = [];

      const storageBalance = await nearViewFunction(this.provider, currencyContractAddress, 'storage_balance_of', { account_id: this.accountId });
      if (!storageBalance) {
        const bound = await nearViewFunction(this.provider, currencyContractAddress, 'storage_balance_bounds');
        transactions.push(this.txObject(
          currencyContractAddress,
          'storage_deposit,',
          { },
          bound.min,
          gas
        ));
      }

      const msg = JSON.stringify({
        nft_contract_id: assetContractAddress,
        token_id: assetTokenId,
        action: 'offer',
        loan_principal_amount: new BigNumber(principal).multipliedBy(10 ** currencyDecimals).toString(10),
        loan_duration: duration,
        loan_currency: currencyContractAddress,
        loan_interest_rate: new BigNumber(rate).multipliedBy(10000).toNumber(),
        available_at: timestampAfter(availableIn),
      });

      transactions.push(
        this.txObject(
          currencyContractAddress,
          'ft_transfer_call,',
          {
            receiver_id: this.lendingProgram,
            amount: new BigNumber(principal).multipliedBy(10 ** currencyDecimals).toString(10),
            msg,
          },
          1,
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
