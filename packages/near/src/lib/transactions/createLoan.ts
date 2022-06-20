import NftPawn, { timestampAfter, TransactionResult } from '@nftpawn-js/core';
import BigNumber from 'bignumber.js';

import { nearViewFunction, NEAR_LOAN_STATUS } from '../utils';
import Transaction from './index';

export default class CreateLoanTx extends Transaction {
  async run(
    assetTokenId: string,
    assetContractAddress: string,
    principal: number,
    rate: number,
    duration: number,
    currencyContractAddress: string,
    currencyDecimals: number,
    availableIn: number,
    loanConfig: number,
  ): Promise<TransactionResult> {
    try {
      const existed = await nearViewFunction(
        this.provider,
        this.lendingProgram,
        'get_sale',
        { nft_contract_token: `${assetContractAddress}||${assetTokenId}` },
      );
      console.log("🚀 ~ file: createLoan.ts ~ line 26 ~ CreateLoanTx ~ existed", existed)
      if (existed  && [NEAR_LOAN_STATUS.Open, NEAR_LOAN_STATUS.Processing].includes(existed.status)) {
        // Request api to sync the asset
        NftPawn.syncBlock({ network: 'NEAR', token_id: assetTokenId, contract_address: assetContractAddress });
        throw new Error('This asset is in a processing loan');
      }
      console.log("🚀 ~ 1")
      const requiredAmount = await nearViewFunction(this.provider, this.lendingProgram, 'storage_minimum_balance');
      console.log("🚀 ~ file: createLoan.ts ~ line 34 ~ CreateLoanTx ~ requiredAmount", requiredAmount)
      
      const msg = JSON.stringify({
        loan_principal_amount: new BigNumber(principal).multipliedBy(10 ** currencyDecimals).toString(10),
        loan_config: loanConfig,
        available_at: timestampAfter(availableIn),
        loan_duration: duration,
        loan_currency: currencyContractAddress,
        loan_interest_rate: new BigNumber(rate).multipliedBy(10000).toNumber(),
      });

      const gas = await this.calculateGasFee();
      const transactions = [
        this.txObject(
          this.lendingProgram,
          'storage_deposit,',
          { account_id: this.accountId },
          requiredAmount,
          gas
        ),
        this.txObject(
          assetContractAddress,
          'nft_approve,',
          { token_id: assetTokenId, account_id: this.lendingProgram, msg },
          requiredAmount,
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
