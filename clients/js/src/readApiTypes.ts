import {
  JsonMetadata,
  Metadata,
} from '@metaplex-foundation/mpl-token-metadata';
import { Option } from '@metaplex-foundation/umi';

export type ReadApiAssetInterface =
  | 'V1_NFT'
  | 'V1_PRINT'
  | 'LEGACY_NFT'
  | 'V2_NFT'
  | 'FungibleAsset'
  | 'Custom'
  | 'Identity'
  | 'Executable'
  | 'ProgrammableNFT';

export type ReadApiPropGroupKey = 'collection';

export type ReadApiPropSortBy = 'created' | 'updated' | 'recent_action';

export type ReadApiPropSortDirection = 'asc' | 'desc';

export type ReadApiParamAssetSortBy = {
  sortBy: ReadApiPropSortBy;
  sortDirection: ReadApiPropSortDirection;
};

export type ReadApiAssetContent = {
  json_uri: string;
  metadata: JsonMetadata;
};

export type ReadApiAssetCompression = {
  eligible: boolean;
  compressed: boolean;
  data_hash: string;
  creator_hash: string;
  asset_hash: string;
  tree: string;
  seq: number;
  leaf_id: number;
};

export type ReadApiAssetOwnership = {
  frozen: boolean;
  delegated: boolean;
  delegate: string | null;
  owner: string;
  ownership_model: 'single' | 'token';
};

export type ReadApiAssetSupply = {
  edition_nonce: number;
  print_current_supply: number;
  print_max_supply: number;
};

export type ReadApiAssetRoyalty = {
  primary_sale_happened: boolean;
  basis_points: number;
};

export type ReadApiAssetGrouping = {
  group_key: ReadApiPropGroupKey;
  group_value: string;
};

export type ReadApiAuthorityScope = 'full';

export type ReadApiAssetAuthority = {
  address: string;
  scopes: ReadApiAuthorityScope[];
};

export type GetAssetProofRpcResponse = {
  root: string;
  proof: string[];
  node_index: number;
  leaf: string;
  tree_id: string;
};

export type GetAssetsByGroupRpcInput = {
  groupKey: ReadApiPropGroupKey;
  groupValue: string;
  page?: Option<number>;
  limit?: Option<number>;
  /* assetId to search before */
  before?: Option<string>;
  /* assetId to search after */
  after?: Option<string>;
  sortBy?: Option<ReadApiParamAssetSortBy>;
};

export type GetAssetsByOwnerRpcInput = {
  /**
   * String of the owner's PublicKey address
   */
  ownerAddress: string;
  page?: Option<number>;
  limit?: Option<number>;
  before?: Option<string>;
  after?: Option<string>;
  sortBy?: Option<ReadApiParamAssetSortBy>;
};

export type ReadApiAsset = {
  /**
   * The asset Id
   */
  id: string;
  interface: ReadApiAssetInterface;
  ownership: ReadApiAssetOwnership;
  mutable: boolean;
  authorities: Array<ReadApiAssetAuthority>;
  content: ReadApiAssetContent;
  royalty: ReadApiAssetRoyalty;
  supply: ReadApiAssetSupply;
  creators: Metadata['creators'];
  grouping: Array<ReadApiAssetGrouping>;
  compression: ReadApiAssetCompression;
};

export type ReadApiAssetList = {
  total: number;
  limit: number;

  /**
   * listing of individual assets, and their associated metadata
   */
  items: Array<ReadApiAsset>;

  /**
   * `page` is only provided when using page based pagination, as apposed
   * to asset id before/after based pagination
   */
  page: Option<number>;

  /**
   * asset Id searching before
   */
  before: Option<string>;

  /**
   * asset Id searching after
   */
  after: Option<string>;

  /**
   * listing of errors provided by the ReadApi RPC
   */
  errors: Option<ReadApiRpcResponseError[]>;
};

export type ReadApiRpcResponseError = {
  error: string;
  id: string;
};
