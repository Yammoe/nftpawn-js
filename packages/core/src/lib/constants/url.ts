export const API_ENDPOINT = {
  'testnet': 'https://testnet.nftpawn.financial/api',
  'mainnet': 'https://nftpawn.financial/api',
};

export const API_URL = {
  SYSTEM_CONFIGS: `/configs`,
  USER_SETTINGS: `/users/settings`,

  COLLECTIONS: `/collections/list`,
  COLLECTION_DETAIL: `/collections/detail`,

  LISTING_LOANS: `/loans/listing`,
  LOANS: `/loans/list`,
  OFERS: `/loans/offers`,
  CREATE_LOAN: `/loans/create`,
  CREATE_OFFER: `/loans/offers/create`,

  ASSET_DETAIL: `/assets/detail`,
  ASSET_INFO: `/assets/info`,

  CURRENCIES: `/currencies/list`,

  SYNC_BLOCK_NEAR: `/loans/near/sync`,
  SYNC_BLOCK_EVM: `/blockchain/{network}/scan-block`,

  OWNED_NFTS: `/moralis/{owner}/nft`,
}  
    