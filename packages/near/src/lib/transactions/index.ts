import { WalletSelector } from '@near-wallet-selector/core';
import NftPawn, { TransactionResult } from '@nftpawn-js/core';

import { NEAR_DEFAULT_GAS } from '../utils';

export default class Transaction {
  lendingProgram;
  accountId;
  walletSelector: WalletSelector;

  constructor(walletSelector: WalletSelector, accountId: string) {
    this.lendingProgram = NftPawn.getConfig().near_nftypawn_address;
    this.walletSelector = walletSelector;
    this.accountId = accountId;
  }

  calculateGasFee = async (): Promise<string | null> => {
    return NEAR_DEFAULT_GAS;
  }

  generateCallbackUrl = (query: any, customUrl?: string): string => {
    const url = new URL(customUrl || `${window.location.origin}${window.location.pathname}`);
    Object.keys(query).forEach(k => url.searchParams.set(k, query[k]));
    return url.toString();
  }

  handleError = async (err: any): Promise<TransactionResult> => {
    if (err?.name === 'WalletSignTransactionError') return {} as TransactionResult;
    throw err;
  };

  handleSuccess = async (res: TransactionResult, assetContractAddress?: string, assetTokenId?: string): Promise<TransactionResult> => {
    if (assetContractAddress && assetTokenId) {
      let count = 0;
      while (count < 6) {
        try {
          const res = await NftPawn.syncBlock({ network: 'NEAR', token_id: assetTokenId, contract_address: assetContractAddress });
          if (res.result) {
            break;
          }
        } catch (err) { }
        await new Promise(r => setTimeout(r, 5000));
        count += 1;
      }
    }
    if (res.txHash) {
      const domain = NftPawn.getConfig().cluster === 'mainnet' ? `https://explorer.near.org` : `https://explorer.testnet.near.org`;
      return { ...res, txExplorerUrl: `${domain}/tx/${res.txHash}`, completed: true };
    }
    return { ...res, completed: true };
  };
}
