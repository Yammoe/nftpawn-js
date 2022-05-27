import ApiController, { GetListingLoanParams, ListParams, LoansParams, OffersParams } from './Api';

interface Options {
  cluster: 'mainnet' | 'testnet',
}

interface AssetParams {
  seo?: string;
  contract_address?: string;
  token_id?: string;
}

export default class NftPawn {
  private api: ApiController;

  static async init(options: Options) {
    const instance = new NftPawn(options);
    return instance;
  }

  private constructor(options: Options) {
    this.api = new ApiController({ cluster: options.cluster });
  }

  async listingLoans(params: GetListingLoanParams) {
    return this.api.getListingLoans(params);
  }

  async loans(params: LoansParams) {
    return this.api.getLoansByFilter(params);
  }

  async loan(params: AssetParams) {
    if (params.seo)
      return this.api.getLoanAsset(params.seo);
    if (params.contract_address && params.token_id)
      return this.api.getAssetInfo(params.contract_address, params.token_id);
    throw Error('Not enough params')
  }

  async offers(params: OffersParams) {
    return this.api.getOffersByFilter(params);
  }

  async collections(params: ListParams) {
    return this.api.getCollections(params);
  }

  async collection(id: number) {
    return this.api.getCollectionById(id);
  }

  async currencies(chain: string) {
    return this.api.getSupportedCurrencies(chain);
  }
}