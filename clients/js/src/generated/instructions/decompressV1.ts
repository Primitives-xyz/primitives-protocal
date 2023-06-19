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
  mapSerializer,
  struct,
  u8,
} from '@metaplex-foundation/umi/serializers';
import { addAccountMeta, addObjectProperty } from '../shared';
import {
  MetadataArgs,
  MetadataArgsArgs,
  getMetadataArgsSerializer,
} from '../types';

// Accounts.
export type DecompressV1InstructionAccounts = {
  voucher: PublicKey | Pda;
  leafOwner: Signer;
  tokenAccount: PublicKey | Pda;
  mint: PublicKey | Pda;
  mintAuthority: PublicKey | Pda;
  metadata: PublicKey | Pda;
  masterEdition: PublicKey | Pda;
  systemProgram?: PublicKey | Pda;
  sysvarRent?: PublicKey | Pda;
  tokenMetadataProgram?: PublicKey | Pda;
  tokenProgram?: PublicKey | Pda;
  associatedTokenProgram: PublicKey | Pda;
  logWrapper?: PublicKey | Pda;
};

// Data.
export type DecompressV1InstructionData = {
  discriminator: Array<number>;
  message: MetadataArgs;
};

export type DecompressV1InstructionDataArgs = { message: MetadataArgsArgs };

/** @deprecated Use `getDecompressV1InstructionDataSerializer()` without any argument instead. */
export function getDecompressV1InstructionDataSerializer(
  _context: object
): Serializer<DecompressV1InstructionDataArgs, DecompressV1InstructionData>;
export function getDecompressV1InstructionDataSerializer(): Serializer<
  DecompressV1InstructionDataArgs,
  DecompressV1InstructionData
>;
export function getDecompressV1InstructionDataSerializer(
  _context: object = {}
): Serializer<DecompressV1InstructionDataArgs, DecompressV1InstructionData> {
  return mapSerializer<
    DecompressV1InstructionDataArgs,
    any,
    DecompressV1InstructionData
  >(
    struct<DecompressV1InstructionData>(
      [
        ['discriminator', array(u8(), { size: 8 })],
        ['message', getMetadataArgsSerializer()],
      ],
      { description: 'DecompressV1InstructionData' }
    ),
    (value) => ({
      ...value,
      discriminator: [54, 85, 76, 70, 228, 250, 164, 81],
    })
  ) as Serializer<DecompressV1InstructionDataArgs, DecompressV1InstructionData>;
}

// Args.
export type DecompressV1InstructionArgs = DecompressV1InstructionDataArgs;

// Instruction.
export function decompressV1(
  context: Pick<Context, 'programs'>,
  input: DecompressV1InstructionAccounts & DecompressV1InstructionArgs
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
    voucher: [input.voucher, true] as const,
    leafOwner: [input.leafOwner, true] as const,
    tokenAccount: [input.tokenAccount, true] as const,
    mint: [input.mint, true] as const,
    mintAuthority: [input.mintAuthority, true] as const,
    metadata: [input.metadata, true] as const,
    masterEdition: [input.masterEdition, true] as const,
    associatedTokenProgram: [input.associatedTokenProgram, false] as const,
  };
  const resolvingArgs = {};
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
  addObjectProperty(
    resolvedAccounts,
    'sysvarRent',
    input.sysvarRent
      ? ([input.sysvarRent, false] as const)
      : ([
          publicKey('SysvarRent111111111111111111111111111111111'),
          false,
        ] as const)
  );
  addObjectProperty(
    resolvedAccounts,
    'tokenMetadataProgram',
    input.tokenMetadataProgram
      ? ([input.tokenMetadataProgram, false] as const)
      : ([
          context.programs.getPublicKey(
            'mplTokenMetadata',
            'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
          ),
          false,
        ] as const)
  );
  addObjectProperty(
    resolvedAccounts,
    'tokenProgram',
    input.tokenProgram
      ? ([input.tokenProgram, false] as const)
      : ([
          context.programs.getPublicKey(
            'splToken',
            'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
          ),
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
  const resolvedArgs = { ...input, ...resolvingArgs };

  addAccountMeta(keys, signers, resolvedAccounts.voucher, false);
  addAccountMeta(keys, signers, resolvedAccounts.leafOwner, false);
  addAccountMeta(keys, signers, resolvedAccounts.tokenAccount, false);
  addAccountMeta(keys, signers, resolvedAccounts.mint, false);
  addAccountMeta(keys, signers, resolvedAccounts.mintAuthority, false);
  addAccountMeta(keys, signers, resolvedAccounts.metadata, false);
  addAccountMeta(keys, signers, resolvedAccounts.masterEdition, false);
  addAccountMeta(keys, signers, resolvedAccounts.systemProgram, false);
  addAccountMeta(keys, signers, resolvedAccounts.sysvarRent, false);
  addAccountMeta(keys, signers, resolvedAccounts.tokenMetadataProgram, false);
  addAccountMeta(keys, signers, resolvedAccounts.tokenProgram, false);
  addAccountMeta(keys, signers, resolvedAccounts.associatedTokenProgram, false);
  addAccountMeta(keys, signers, resolvedAccounts.logWrapper, false);

  // Data.
  const data =
    getDecompressV1InstructionDataSerializer().serialize(resolvedArgs);

  // Bytes Created On Chain.
  const bytesCreatedOnChain = 0;

  return transactionBuilder([
    { instruction: { keys, programId, data }, signers, bytesCreatedOnChain },
  ]);
}
