import { CollectionParams, CollectionVerifiedParams, GetListingLoanParams, ListParams, LoansParams, OffersParams, SyncBlockParams, TransactionParams }  from './api.interface';
import ApiController from './Api';

interface Options {
  cluster: 'mainnet' | 'testnet',
}

interface AssetParams {
  seo?: string;
  contract_address?: string;
  token_id?: string;
}

interface NftPawnConfig {
  near_nftypawn_address: string;
  cluster: string;
}

let api: ApiController;
let config: NftPawnConfig; 

const NftPawn = {

  async init(options: Options) {
    api = new ApiController({ cluster: options.cluster });
    const res = await api.getNftPawnConfig();
    config = {
      near_nftypawn_address: res.result.near_nftypawn_address,
      cluster: options.cluster,
    };
  },

  getConfig(): NftPawnConfig {
    return config;
  },

  async marketStats() {
    return api.getNftPawnStats();
  },

  /**
  * Get current listing loans on NftPawn with conditions
  * @param params condition to filter returned loans
  * @returns array of listing loans
  */
  async listingLoans(params: GetListingLoanParams) {
    return api.getListingLoans(params);
  },

  async loans(params: LoansParams) {
    return api.getLoansByFilter(params);
  },

  async loan(params: AssetParams) {
    if (params.seo)
      return api.getLoanAsset(params.seo);
    if (params.contract_address && params.token_id)
      return api.getAssetInfo(params.contract_address, params.token_id);
    throw Error('Not enough params')
  },

  async offers(params: OffersParams) {
    return api.getOffersByFilter(params);
  },

  async collections(params?: ListParams) {
    return api.getCollections(params);
  },

  async collection(params: CollectionParams) {
    return api.getCollection(params);
  },

  async collectionVerified(params: CollectionVerifiedParams) {
    return api.getCollectionVerified(params);
  },

  async currencies(chain: string) {
    return api.getSupportedCurrencies(chain);
  },

  async loanTransactions(params: TransactionParams) {
    return api.getLoanTransactions(params);
  },
  
  async assetTransactions(params: TransactionParams) {
    return api.getAssetTransactions(params);
  },

  async borrower(address: string) {
    return api.getBorrowStats(address);
  },


  async syncBlock(params: SyncBlockParams) {
    return api.syncBlock(params);
  },
}

export default NftPawn;