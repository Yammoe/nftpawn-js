import { WalletSelector } from '@near-wallet-selector/core';
import * as nearAPI from "near-api-js";
import { AccountView, CodeResult } from "near-api-js/lib/providers/provider";

export const NEAR_DEFAULT_GAS =
  nearAPI.utils.format.parseNearAmount("0.0000000003");

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

export async function getNearBalance(
  address: string
): Promise<number | string> {
  const res = await getNearProvider().query<AccountView>({
    request_type: "view_account",
    account_id: address,
    finality: "final",
  });
  return nearAPI.utils.format.formatNearAmount(res.amount);
}

export async function getTokenBalance(
  owner: string,
  contractAddress: string
): Promise<any> {
  const res = await nearViewFunction(contractAddress, "ft_balance_of", {
    account_id: owner,
  });
  return res;
}

export const nearViewFunction = async (
  accountId: string,
  methodName: string,
  args?: any
) => {
  const res = await getNearProvider().query<CodeResult>({
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

function toHexString(byteArray: any) {
  return Array.from(byteArray, function (byte: any) {
    return ("0" + (byte & 0xff).toString(16)).slice(-2);
  }).join("");
}

export const nearSignText = async (accountId: string, data: string): Promise<string> => {
  try {
    const keyStore = new nearAPI.keyStores.BrowserLocalStorageKeyStore();
    const keyPair = await keyStore.getKey(getNearConfig().networkId, accountId);

    const msg = Buffer.from(data);
    const { signature } = keyPair.sign(msg);

    const signatureToHex = toHexString(signature);
    return signatureToHex;
  } catch (error) {
    throw error;
  }
};
