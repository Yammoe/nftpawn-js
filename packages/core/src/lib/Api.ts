import axios, { Axios } from 'axios';
import { CollectionData, CurrencyData, ListResponse, LoanData, OfferData, ResponseResult } from './ApiModel';
import { Chain } from './constants/network';
import { API_ENDPOINT, API_URL } from './constants/url';
import { isEvmChain } from './utils';

interface Options {
  cluster: 'mainnet' | 'testnet';
}

export interface ListParams {
  page?: number;
  limit?: number;
}

export interface GetListingLoanParams extends ListParams {
  collection_id?: number | undefined;
  exclude_ids?: string;
  min_price?: number;
  max_price?: number;
  collection?: string;
  network?: string;
}

export interface LoansParams extends ListParams {
  owner?: string;
  status?: "new" | "created" | "cancelled" | "done" | "liquidated";
}

export interface OffersParams {
  borrower?: string;
  lender?: string;
  network?: string;
  status?: "new" | "approved" | "rejected" | "cancelled" | "done" | "liquidated" | "repaid";
}
export interface LoanTransactionParams {
  status?: "listed" | "cancelled" | "offered" | "repaid" | "liquidated";
  asset_id: string;
}

export interface SyncBlockParams {
  network: string;
  block_number: string;
  contract_address: 'string';
  token_id: 'string';
}

export default class ApiController {
  private axioInstance: Axios;

  constructor(options: Options) {
    this.axioInstance = axios.create({
      baseURL: API_ENDPOINT[options.cluster]
    });
    this.axioInstance.interceptors.request.use(function (config) {
      return config;
    }, function (error) {
      return Promise.reject(error);
    });
    this.axioInstance.interceptors.response.use(
      function (response) {
      return response.data;
    }, function (error) {
      return Promise.reject(error);
    });
  }
  
  async getSupportedCurrencies(network: string): Promise<ListResponse<CurrencyData>> {
    return this.axioInstance.get(`${API_URL.CURRENCIES}?network=${network}`);
  };
  
  async getCollections(params?: ListParams): Promise<ListResponse<CollectionData>> {
    return this.axioInstance.get(API_URL.COLLECTIONS, { params });
  };
  
  async getCollectionById(id: number | string): Promise<ResponseResult> {
    return this.axioInstance.get(`${API_URL.COLLECTION_DETAIL}/${id}`);
  };
  
  async getListingLoans(params?: GetListingLoanParams): Promise<ListResponse<LoanData>> {
    return this.axioInstance.get(API_URL.LISTING_LOANS, { params });
  };
  
  async getLoanAsset(asset_seo: string): Promise<ResponseResult> {
    return this.axioInstance.get(`${API_URL.ASSET_DETAIL}/${asset_seo}`);
  };
  
  async getAssetInfo(contractAddress: string, tokenId?: string): Promise<ResponseResult> {
    return this.axioInstance.get(
      API_URL.ASSET_INFO,
      { params: { contract_address: contractAddress, token_id: tokenId } },
    );
  };
  
  async getLoansByFilter(params: LoansParams): Promise<ListResponse<LoanData>> {
    return this.axioInstance.get(`${API_URL.LOANS}`, { params });
  };
  
  async getOffersByFilter(params: OffersParams): Promise<ListResponse<OfferData>> {
    return this.axioInstance.get(`${API_URL.OFERS}`, { params });
  };

  async syncBlock(params: SyncBlockParams): Promise<ResponseResult> {
    if (params.network === Chain.Near) {
      return this.axioInstance.post(
        API_URL.SYNC_BLOCK_NEAR, 
        { token_id: params.token_id, contract_address: params.contract_address }
      );
    }
    if (isEvmChain(params.network)) {
      return this.axioInstance.post(`${API_URL.SYNC_BLOCK_EVM.replace('{network}', params.network)}/${params.block_number}`)
    }
    throw Error('Chain is not supported');
  }
}
