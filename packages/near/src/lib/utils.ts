import { WalletSelector, Transaction } from '@near-wallet-selector/core';
import * as nearAPI from "near-api-js";
import { AccountView, CodeResult } from "near-api-js/lib/providers/provider";

export const NEAR_DEFAULT_GAS =
  nearAPI.utils.format.parseNearAmount("0.0000000003");

export type WalletSelectorTransaction = Transaction

export enum NEAR_LOAN_STATUS {
  Open = 0,
  Processing = 1,
  Done = 2,
  Liquidated = 3,
  Refunded = 4,
  Canceled = 5,
}

export const getNearProvider = (selector: WalletSelector) => {
  const { nodeUrl } = selector.options.network;
  const provider = new nearAPI.providers.JsonRpcProvider({ url: nodeUrl });

  return provider;
};

export const nearViewFunction = async (
  provider: nearAPI.providers.JsonRpcProvider,
  accountId: string,
  methodName: string,
  args?: any
) => {
  const res = await provider.query<CodeResult>({
    request_type: "call_function",
    account_id: accountId,
    finality: "optimistic",
    method_name: methodName,
    args_base64: args
      ? Buffer.from(JSON.stringify(args)).toString("base64")
      : "",
  });
  return JSON.parse(Buffer.from(res.result).toString());
};

export async function getNearBalance(
  provider: nearAPI.providers.JsonRpcProvider,
  address: string,
): Promise<number | string> {
  const res = await provider.query<AccountView>({
    request_type: "view_account",
    account_id: address,
    finality: "final",
  });
  return nearAPI.utils.format.formatNearAmount(res.amount);
}

export async function getTokenBalance(
  provider: nearAPI.providers.JsonRpcProvider,
  owner: string,
  contractAddress: string
): Promise<any> {
  const res = await nearViewFunction(provider, contractAddress, "ft_balance_of", {
    account_id: owner,
  });
  return res;
}