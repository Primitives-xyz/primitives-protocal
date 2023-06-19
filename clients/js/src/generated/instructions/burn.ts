/**
 * This code was AUTOGENERATED using the kinobi library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun kinobi to update it.
 *
 * @see https://github.com/metaplex-foundation/kinobi
 */

import {
  AccountMeta,
  Context,
  Pda,
  PublicKey,
  Signer,
  TransactionBuilder,
  publicKey,
  transactionBuilder,
} from '@metaplex-foundation/umi';
import {
  Serializer,
  array,
  bytes,
  mapSerializer,
  struct,
  u32,
  u64,
  u8,
} from '@metaplex-foundation/umi/serializers';
import { findTreeConfigPda } from '../accounts';
import { addAccountMeta, addObjectProperty } from '../shared';

// Accounts.
export type BurnInstructionAccounts = {
  treeAuthority?: PublicKey | Pda;
  leafOwner: PublicKey | Pda;
  leafDelegate: PublicKey | Pda;
  merkleTree: PublicKey | Pda;
  logWrapper?: PublicKey | Pda;
  compressionProgram?: PublicKey | Pda;
  systemProgram?: PublicKey | Pda;
};

// Data.
export type BurnInstructionData = {
  discriminator: Array<number>;
  root: Uint8Array;
  dataHash: Uint8Array;
  creatorHash: Uint8Array;
  nonce: bigint;
  index: number;
};

export type BurnInstructionDataArgs = {
  root: Uint8Array;
  dataHash: Uint8Array;
  creatorHash: Uint8Array;
  nonce: number | bigint;
  index: number;
};

/** @deprecated Use `getBurnInstructionDataSerializer()` without any argument instead. */
export function getBurnInstructionDataSerializer(
  _context: object
): Serializer<BurnInstructionDataArgs, BurnInstructionData>;
export function getBurnInstructionDataSerializer(): Serializer<
  BurnInstructionDataArgs,
  BurnInstructionData
>;
export function getBurnInstructionDataSerializer(
  _context: object = {}
): Serializer<BurnInstructionDataArgs, BurnInstructionData> {
  return mapSerializer<BurnInstructionDataArgs, any, BurnInstructionData>(
    struct<BurnInstructionData>(
      [
        ['discriminator', array(u8(), { size: 8 })],
        ['root', bytes({ size: 32 })],
        ['dataHash', bytes({ size: 32 })],
        ['creatorHash', bytes({ size: 32 })],
        ['nonce', u64()],
        ['index', u32()],
      ],
      { description: 'BurnInstructionData' }
    ),
    (value) => ({
      ...value,
      discriminator: [116, 110, 29, 56, 107, 219, 42, 93],
    })
  ) as Serializer<BurnInstructionDataArgs, BurnInstructionData>;
}

// Args.
export type BurnInstructionArgs = BurnInstructionDataArgs;

// Instruction.
export function burn(
  context: Pick<Context, 'programs' | 'eddsa'>,
  input: BurnInstructionAccounts & BurnInstructionArgs
): TransactionBuilder {
  const signers: Signer[] = [];
  const keys: AccountMeta[] = [];

  // Program ID.
  const programId = context.programs.getPublicKey(
    'mplBubblegum',
    'BGUMAp9Gq7iTEuizy4pqaxsTyUCBK68MDfK752saRPUY'
  );

  // Resolved inputs.
  const resolvedAccounts = {
    leafOwner: [input.leafOwner, false] as const,
    leafDelegate: [input.leafDelegate, false] as const,
    merkleTree: [input.merkleTree, true] as const,
  };
  const resolvingArgs = {};
  addObjectProperty(
    resolvedAccounts,
    'treeAuthority',
    input.treeAuthority
      ? ([input.treeAuthority, false] as const)
      : ([
          findTreeConfigPda(context, {
            merkleTree: publicKey(input.merkleTree, false),
          }),
          false,
        ] as const)
  );
  addObjectProperty(
    resolvedAccounts,
    'logWrapper',
    input.logWrapper
      ? ([input.logWrapper, false] as const)
      : ([
          context.programs.getPublicKey(
            'splNoop',
            'noopb9bkMVfRPU8AsbpTUg8AQkHtKwMYZiFUjNRtMmV'
          ),
          false,
        ] as const)
  );
  addObjectProperty(
    resolvedAccounts,
    'compressionProgram',
    input.compressionProgram
      ? ([input.compressionProgram, false] as const)
      : ([
          context.programs.getPublicKey(
            'splAccountCompression',
            'cmtDvXumGCrqC1Age74AVPhSRVXJMd8PJS91L8KbNCK'
          ),
          false,
        ] as const)
  );
  addObjectProperty(
    resolvedAccounts,
    'systemProgram',
    input.systemProgram
      ? ([input.systemProgram, false] as const)
      : ([
          context.programs.getPublicKey(
            'splSystem',
            '11111111111111111111111111111111'
          ),
          false,
        ] as const)
  );
  const resolvedArgs = { ...input, ...resolvingArgs };

  addAccountMeta(keys, signers, resolvedAccounts.treeAuthority, false);
  addAccountMeta(keys, signers, resolvedAccounts.leafOwner, false);
  addAccountMeta(keys, signers, resolvedAccounts.leafDelegate, false);
  addAccountMeta(keys, signers, resolvedAccounts.merkleTree, false);
  addAccountMeta(keys, signers, resolvedAccounts.logWrapper, false);
  addAccountMeta(keys, signers, resolvedAccounts.compressionProgram, false);
  addAccountMeta(keys, signers, resolvedAccounts.systemProgram, false);

  // Data.
  const data = getBurnInstructionDataSerializer().serialize(resolvedArgs);

  // Bytes Created On Chain.
  const bytesCreatedOnChain = 0;

  return transactionBuilder([
    { instruction: { keys, programId, data }, signers, bytesCreatedOnChain },
  ]);
}
