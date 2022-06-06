import axios, { Axios } from 'axios';
import { CollectionParams, CollectionVerifiedParams, GetListingLoanParams, ListParams, LoansParams, OffersParams, Options, SyncBlockParams, TransactionParams } from './api.interface';
import { CollectionData, CurrencyData, ListResponse, LoanData, OfferData, ResponseResult } from './api.model';
import { Chain } from './constants/network';
import { API_ENDPOINT, API_URL } from './constants/url';
import { isEvmChain } from './utils';

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
  
  async getNftPawnConfig(): Promise<ResponseResult> {
    return this.axioInstance.get(API_URL.SYSTEM_CONFIGS);
  };

  async getNftPawnStats(): Promise<ResponseResult> {
    return this.axioInstance.get(API_URL.PLATFORM_STATS);
  };

  async getSupportedCurrencies(network: string): Promise<ListResponse<CurrencyData>> {
    return this.axioInstance.get(`${API_URL.CURRENCIES}?network=${network}`);
  };
  
  async getCollection(params: CollectionParams): Promise<ResponseResult> {
    return this.axioInstance.get(`${API_URL.COLLECTION_DETAIL}/${params.seo_url || params.id}`);
  };

  async getCollections(params?: ListParams): Promise<ListResponse<CollectionData>> {
    return this.axioInstance.get(API_URL.COLLECTIONS, { params });
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

  async getLoanTransactions(params: TransactionParams): Promise<ListResponse<any>> {
    return this.axioInstance.get(`${API_URL.LOAN_TRANSACTIONS}`, { params });
  };

  async getAssetTransactions(params: TransactionParams): Promise<ListResponse<any>> {
    return this.axioInstance.get(`${API_URL.ASSET_TRANSACTIONS}`, { params });
  };

  async getBorrowStats(address: string): Promise<ResponseResult> {
    return this.axioInstance.get(`${API_URL.BORROWER_STATS}/${address}`);
  };

  async getCollectionVerified(params: CollectionVerifiedParams): Promise<ResponseResult> {
    return this.axioInstance.get(API_URL.COLLECTION_VERIFIED, { params });
  };

  async syncBlock(params: SyncBlockParams): Promise<ResponseResult> {
    if (params.network === 'NEAR') {
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
