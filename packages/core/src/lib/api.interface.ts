import { Chain } from './constants/network';


/**
 * @interface Options - params to initialize NftPawn api service
 * @member {string} cluster - cluster where the application run on
*/
export interface Options {
  cluster: 'mainnet' | 'testnet';
}


/**
 * @interface ListParams - general params when query for a list on NftPawn
 * @member {number} page - used for pagination, start from 1
 * @member {number} limit - used for pagination, default is 500
*/
export interface ListParams {
  page?: number;
  limit?: number;
}


/**
  * @interface GetListingLoanParams - conditions to filter listing loans on NftPawn
  * @member {string} collection_id - collection ID generated by NftPawn
  * @member {string} collection_seo_url - collection seo url
  * @member {string} exclude_ids l- oan ID to exclude
  * @member {number} min_price - minimum principal amount of loans
  * @member {number} max_price - maximum principal amoutn of loans
  * @member {string} network - chain symbol
  * @member {string} search - keyword matching on [asset name, contract address] of a loan
*/
export interface GetListingLoanParams extends ListParams {
  collection_id?: number;
  collection_seo_url?: string;
  exclude_ids?: string;
  min_price?: number;
  max_price?: number;
  network?: Chain;
  search?: string;
}


/**
  * @interface LoansParams - conditions to filter loans on NftPawn
  * @member {string} owner - borrower address of returned loans
  * @member {string} status - status of returned loans
*/
export interface LoansParams extends ListParams {
  owner?: string;
  status?: "new" | "created" | "cancelled" | "done" | "liquidated";
}


/**
  * @interface CollectionParams - params to get single collection on NftPawn
  * @member {number} id - collection ID generated by NftPawn
  * @member {string} seo_url - collection seo_url generated by NftPawn
*/
export interface CollectionParams {
  id?: number;
  seo_url?: string;
}


/**
  * @interface OffersParams - conditions to filter offers on NftPawn
  * @member {string} borrower - borrower address of returned offers
  * @member {string} lender - lender address of returned offers
  * @member {string} network - chain symbol
  * @member {string} status - status of returned offers
*/
export interface OffersParams {
  borrower?: string;
  lender?: string;
  network?: Chain;
  status?: "new" | "approved" | "rejected" | "cancelled" | "done" | "liquidated" | "repaid";
}


/**
  * @interface TransactionParams - conditions to get sale transactions of an asset collected by NftPawn
  * @member {string | number} asset_id - asset ID generated by NftPawn
  * @member {string} status - status of returned transactions
*/
export interface TransactionParams {
  asset_id: string | number;
  status?: "listed" | "cancelled" | "offered" | "repaid" | "liquidated";
}


/**
  * @interface CollectionVerifiedParams - conditions to get verification info of a collection on NftPawn
  * @member {string | number} token_id - asset token ID
  * @member {string} contract_address - asset contract address
  * @member {string} network - chain symbol
*/
export interface CollectionVerifiedParams {
  token_id: string | number;
  contract_address: string;
  network: Chain;
}


/**
  * @interface SyncBlockParams - params to request NftPawn sync data with blockchain
  * @member {string | number} block_number - block number of the transaction
  *   * @member {string | number} token_id - asset token ID
  * @member {string} contract_address - asset contract address
  * @member {string} network - chain symbol
*/
export interface SyncBlockParams {
  block_number?: string | number;
  token_id: string | number;
  contract_address: string;
  network: Chain;
}
