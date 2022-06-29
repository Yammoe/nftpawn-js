export const API_ENDPOINT = {
  'dev': 'https://dev.nftpawn.financial/api',
  'testnet': 'https://testnet.nftpawn.financial/api',
  'mainnet': 'https://nftpawn.financial/api',
};

export const API_URL = {
  SYSTEM_CONFIGS: `/configs`,

  COLLECTIONS: `/collections/list`,
  COLLECTION_DETAIL: `/collections/detail`,
  COLLECTION_VERIFIED: `/collections/verified`,

  PLATFORM_STATS: `/loans/platform-stats`,
  LISTING_LOANS: `/loans/listing`,
  LOANS: `/loans/list`,
  OFERS: `/loans/offers`,
  CREATE_LOAN: `/loans/create`,
  CREATE_OFFER: `/loans/offers/create`,
  LOAN_TRANSACTIONS: `/loans/transactions`,
  BORROWER_STATS: `/loans/borrower-stats`,

  ASSET_DETAIL: `/assets/detail`,
  ASSET_INFO: `/assets/info`,
  ASSET_TRANSACTIONS: `/assets/transactions`,

  CURRENCIES: `/currencies/list`,

  SYNC_BLOCK_NEAR: `/loans/near/sync`,
  SYNC_BLOCK_EVM: `/blockchain/{network}/scan-block`,

  OWNED_NFTS: `/moralis/{owner}/nft`,

}  
    