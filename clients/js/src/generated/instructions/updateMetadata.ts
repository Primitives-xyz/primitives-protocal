/**
 * This code was AUTOGENERATED using the kinobi library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun kinobi to update it.
 *
 * @see https://github.com/metaplex-foundation/kinobi
 */

import { findMetadataPda } from '@metaplex-foundation/mpl-token-metadata';
import {
  Context,
  Pda,
  PublicKey,
  Signer,
  TransactionBuilder,
  transactionBuilder,
} from '@metaplex-foundation/umi';
import {
  Serializer,
  array,
  bool,
  bytes,
  mapSerializer,
  string,
  struct,
  u32,
  u64,
  u8,
} from '@metaplex-foundation/umi/serializers';
import { findTreeConfigPda } from '../accounts';
import {
  PickPartial,
  ResolvedAccount,
  ResolvedAccountsWithIndices,
  expectPublicKey,
  expectSome,
  getAccountMetasAndSigners,
} from '../shared';
import {
  Creator,
  CreatorArgs,
  NodeArgs,
  NodeArgsArgs,
  Properties,
  PropertiesArgs,
  getCreatorSerializer,
  getNodeArgsSerializer,
  getPropertiesSerializer,
} from '../types';

// Accounts.
export type UpdateMetadataInstructionAccounts = {
  treeConfig?: PublicKey | Pda;
  /**
   * Either collection authority or tree owner/delegate, depending
   * on whether the item is in a verified collection
   */

  authority?: Signer;
  /** Used when item is in a verified collection */
  collectionMint?: PublicKey | Pda;
  /** Used when item is in a verified collection */
  collectionMetadata?: PublicKey | Pda;
  collectionAuthorityRecordPda?: PublicKey | Pda;
  leafOwner: PublicKey | Pda;
  leafDelegate?: PublicKey | Pda;
  payer?: Signer;
  merkleTree: PublicKey | Pda;
  logWrapper?: PublicKey | Pda;
  compressionProgram?: PublicKey | Pda;
  tokenMetadataProgram?: PublicKey | Pda;
  systemProgram?: PublicKey | Pda;
};

// Data.
export type UpdateMetadataInstructionData = {
  discriminator: Array<number>;
  root: Uint8Array;
  nonce: bigint;
  index: number;
  currentMetadata: NodeArgs;
  /** The name of the asset */
  label: string;
  properties: Array<Properties>;
  isMutable: boolean;
  creators: Array<Creator>;
};

export type UpdateMetadataInstructionDataArgs = {
  root: Uint8Array;
  nonce: number | bigint;
  index: number;
  currentMetadata: NodeArgsArgs;
  /** The name of the asset */
  label: string;
  properties: Array<PropertiesArgs>;
  isMutable: boolean;
  creators: Array<CreatorArgs>;
};

export function getUpdateMetadataInstructionDataSerializer(): Serializer<
  UpdateMetadataInstructionDataArgs,
  UpdateMetadataInstructionData
> {
  return mapSerializer<
    UpdateMetadataInstructionDataArgs,
    any,
    UpdateMetadataInstructionData
  >(
    struct<UpdateMetadataInstructionData>(
      [
        ['discriminator', array(u8(), { size: 8 })],
        ['root', bytes({ size: 32 })],
        ['nonce', u64()],
        ['index', u32()],
        ['currentMetadata', getNodeArgsSerializer()],
        ['label', string()],
        ['properties', array(getPropertiesSerializer())],
        ['isMutable', bool()],
        ['creators', array(getCreatorSerializer())],
      ],
      { description: 'UpdateMetadataInstructionData' }
    ),
    (value) => ({
      ...value,
      discriminator: [170, 182, 43, 239, 97, 78, 225, 186],
    })
  ) as Serializer<
    UpdateMetadataInstructionDataArgs,
    UpdateMetadataInstructionData
  >;
}

// Extra Args.
export type UpdateMetadataInstructionExtraArgs = { proof: Array<PublicKey> };

// Args.
export type UpdateMetadataInstructionArgs = PickPartial<
  UpdateMetadataInstructionDataArgs & UpdateMetadataInstructionExtraArgs,
  'proof'
>;

// Instruction.
export function updateMetadata(
  context: Pick<Context, 'eddsa' | 'identity' | 'payer' | 'programs'>,
  input: UpdateMetadataInstructionAccounts & UpdateMetadataInstructionArgs
): TransactionBuilder {
  // Program ID.
  const programId = context.programs.getPublicKey(
    'primitivesProtractor',
    'graphmieBkazqwUYt9HJZz5FZmGVngPcrRwCZ4PWGGE'
  );

  // Accounts.
  const resolvedAccounts = {
    treeConfig: {
      index: 0,
      isWritable: false as boolean,
      value: input.treeConfig ?? null,
    },
    authority: {
      index: 1,
      isWritable: false as boolean,
      value: input.authority ?? null,
    },
    collectionMint: {
      index: 2,
      isWritable: false as boolean,
      value: input.collectionMint ?? null,
    },
    collectionMetadata: {
      index: 3,
      isWritable: false as boolean,
      value: input.collectionMetadata ?? null,
    },
    collectionAuthorityRecordPda: {
      index: 4,
      isWritable: false as boolean,
      value: input.collectionAuthorityRecordPda ?? null,
    },
    leafOwner: {
      index: 5,
      isWritable: false as boolean,
      value: input.leafOwner ?? null,
    },
    leafDelegate: {
      index: 6,
      isWritable: false as boolean,
      value: input.leafDelegate ?? null,
    },
    payer: {
      index: 7,
      isWritable: false as boolean,
      value: input.payer ?? null,
    },
    merkleTree: {
      index: 8,
      isWritable: true as boolean,
      value: input.merkleTree ?? null,
    },
    logWrapper: {
      index: 9,
      isWritable: false as boolean,
      value: input.logWrapper ?? null,
    },
    compressionProgram: {
      index: 10,
      isWritable: false as boolean,
      value: input.compressionProgram ?? null,
    },
    tokenMetadataProgram: {
      index: 11,
      isWritable: false as boolean,
      value: input.tokenMetadataProgram ?? null,
    },
    systemProgram: {
      index: 12,
      isWritable: false as boolean,
      value: input.systemProgram ?? null,
    },
  } satisfies ResolvedAccountsWithIndices;

  // Arguments.
  const resolvedArgs: UpdateMetadataInstructionArgs = { ...input };

  // Default values.
  if (!resolvedAccounts.treeConfig.value) {
    resolvedAccounts.treeConfig.value = findTreeConfigPda(context, {
      merkleTree: expectPublicKey(resolvedAccounts.merkleTree.value),
    });
  }
  if (!resolvedAccounts.authority.value) {
    resolvedAccounts.authority.value = context.identity;
  }
  if (!resolvedAccounts.collectionMetadata.value) {
    if (resolvedAccounts.collectionMint.value) {
      resolvedAccounts.collectionMetadata.value = findMetadataPda(context, {
        mint: expectPublicKey(resolvedAccounts.collectionMint.value),
      });
    }
  }
  if (!resolvedAccounts.leafDelegate.value) {
    resolvedAccounts.leafDelegate.value = expectSome(
      resolvedAccounts.leafOwner.value
    );
  }
  if (!resolvedAccounts.payer.value) {
    resolvedAccounts.payer.value = context.payer;
  }
  if (!resolvedAccounts.logWrapper.value) {
    resolvedAccounts.logWrapper.value = context.programs.getPublicKey(
      'splNoop',
      'noopb9bkMVfRPU8AsbpTUg8AQkHtKwMYZiFUjNRtMmV'
    );
    resolvedAccounts.logWrapper.isWritable = false;
  }
  if (!resolvedAccounts.compressionProgram.value) {
    resolvedAccounts.compressionProgram.value = context.programs.getPublicKey(
      'splAccountCompression',
      'cmtDvXumGCrqC1Age74AVPhSRVXJMd8PJS91L8KbNCK'
    );
    resolvedAccounts.compressionProgram.isWritable = false;
  }
  if (!resolvedAccounts.tokenMetadataProgram.value) {
    resolvedAccounts.tokenMetadataProgram.value = context.programs.getPublicKey(
      'mplTokenMetadata',
      'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
    );
    resolvedAccounts.tokenMetadataProgram.isWritable = false;
  }
  if (!resolvedAccounts.systemProgram.value) {
    resolvedAccounts.systemProgram.value = context.programs.getPublicKey(
      'splSystem',
      '11111111111111111111111111111111'
    );
    resolvedAccounts.systemProgram.isWritable = false;
  }
  if (!resolvedArgs.proof) {
    resolvedArgs.proof = [];
  }

  // Accounts in order.
  const orderedAccounts: ResolvedAccount[] = Object.values(
    resolvedAccounts
  ).sort((a, b) => a.index - b.index);

  // Remaining Accounts.
  const remainingAccounts = resolvedArgs.proof.map((value, index) => ({
    index,
    value,
    isWritable: false,
  }));
  orderedAccounts.push(...remainingAccounts);

  // Keys and Signers.
  const [keys, signers] = getAccountMetasAndSigners(
    orderedAccounts,
    'programId',
    programId
  );

  // Data.
  const data = getUpdateMetadataInstructionDataSerializer().serialize(
    resolvedArgs as UpdateMetadataInstructionDataArgs
  );

  // Bytes Created On Chain.
  const bytesCreatedOnChain = 0;

  return transactionBuilder([
    { instruction: { keys, programId, data }, signers, bytesCreatedOnChain },
  ]);
}
