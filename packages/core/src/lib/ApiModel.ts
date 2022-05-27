export interface ResponseResult {
  error: any;
  result: any;
}

export interface ListResponse<T> extends ResponseResult {
  count: number | undefined;
  result: Array<T>;
}

export interface AssetAttribute {
  trait_type: string;
  value: string | number;
}

export interface CurrencyData {
  admin_fee_address: string;
  balance: number;
  contract_address: string;
  created_at: string;
  decimals: number;
  icon_url: string;
  id: number;
  name: string;
  network: string;
  symbol: string;
  updated_at: string;
  price: number;
}

export interface CollectionData {
  id: number;
  name: string;
  seo_url: string;
  description: string;
  total_listed: number;
  listing_total: number;
  avg24h_amount: number;
  total_volume: number;
  listing_asset?: AssetData;
  rand_asset?: AssetData;
  network: string;
  verified: boolean;
}

export interface LoanData {
  id: number;
  asset: AssetData;
  currency: CurrencyData;
  principal_amount: number;
  interest_rate: number;
  duration: number;
  data_asset_address: string;
  data_loan_address: string;
  network: string;
  owner: string;
  nonce_hex: string;
  signature: string;
  status: string;
  created_at: string;
  updated_at: string;
  init_tx_hash: string;
  offers: Array<OfferData>;
  approved_offer: OfferData;
  offer_started_at: string;
  offer_expired_at: string;
  valid_at: string;
  config: number;
}

export interface AssetData {
  id: number;
  name: string;
  network: string;
  token_id: string;
  contract_address: string;
  collection?: CollectionData;
  token_url: string;
  seo_url: string;
  mime_type: string;
  attributes: AssetAttribute;
  new_loan?: LoanData;
  seller_fee_rate: number;
  description: string;
  origin_contract_network: string;
  origin_contract_address: string;
  origin_token_id: string;
  stats: AssetStatData;
}

export interface OfferData {
  id: number;
  lender: string;
  status: string;
  principal_amount: number;
  interest_rate: number;
  duration: number;
  loan: LoanData;
  loan_id: number;
  data_offer_address: string;
  data_currency_address: string;
  created_at: string;
  updated_at: string;
  valid_at: string;
  accept_tx_hash: string;
  close_tx_hash: string;
  nonce_hex: string;
  signature: string;
}

export interface AssetStatData {
  id: number;
  avg_price: number;
  currency: CurrencyData;
  floor_price: number;
}