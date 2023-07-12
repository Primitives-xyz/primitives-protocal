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
  u8,
} from '@metaplex-foundation/umi/serializers';
import { findTreeConfigPda } from '../accounts';
import { addAccountMeta, addObjectProperty } from '../shared';

// Accounts.
export type CancelRedeemInstructionAccounts = {
  treeConfig?: PublicKey | Pda;
  leafOwner: Signer;
  merkleTree: PublicKey | Pda;
  voucher: PublicKey | Pda;
  logWrapper?: PublicKey | Pda;
  compressionProgram?: PublicKey | Pda;
  systemProgram?: PublicKey | Pda;
};

// Data.
export type CancelRedeemInstructionData = {
  discriminator: Array<number>;
  root: Uint8Array;
};

export type CancelRedeemInstructionDataArgs = { root: Uint8Array };

/** @deprecated Use `getCancelRedeemInstructionDataSerializer()` without any argument instead. */
export function getCancelRedeemInstructionDataSerializer(
  _context: object
): Serializer<CancelRedeemInstructionDataArgs, CancelRedeemInstructionData>;
export function getCancelRedeemInstructionDataSerializer(): Serializer<
  CancelRedeemInstructionDataArgs,
  CancelRedeemInstructionData
>;
export function getCancelRedeemInstructionDataSerializer(
  _context: object = {}
): Serializer<CancelRedeemInstructionDataArgs, CancelRedeemInstructionData> {
  return mapSerializer<
    CancelRedeemInstructionDataArgs,
    any,
    CancelRedeemInstructionData
  >(
    struct<CancelRedeemInstructionData>(
      [
        ['discriminator', array(u8(), { size: 8 })],
        ['root', bytes({ size: 32 })],
      ],
      { description: 'CancelRedeemInstructionData' }
    ),
    (value) => ({
      ...value,
      discriminator: [111, 76, 232, 50, 39, 175, 48, 242],
    })
  ) as Serializer<CancelRedeemInstructionDataArgs, CancelRedeemInstructionData>;
}

// Args.
export type CancelRedeemInstructionArgs = CancelRedeemInstructionDataArgs;

// Instruction.
export function cancelRedeem(
  context: Pick<Context, 'programs' | 'eddsa'>,
  input: CancelRedeemInstructionAccounts & CancelRedeemInstructionArgs
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
    leafOwner: [input.leafOwner, true] as const,
    merkleTree: [input.merkleTree, true] as const,
    voucher: [input.voucher, true] as const,
  };
  const resolvingArgs = {};
  addObjectProperty(
    resolvedAccounts,
    'treeConfig',
    input.treeConfig
      ? ([input.treeConfig, false] as const)
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

  addAccountMeta(keys, signers, resolvedAccounts.treeConfig, false);
  addAccountMeta(keys, signers, resolvedAccounts.leafOwner, false);
  addAccountMeta(keys, signers, resolvedAccounts.merkleTree, false);
  addAccountMeta(keys, signers, resolvedAccounts.voucher, false);
  addAccountMeta(keys, signers, resolvedAccounts.logWrapper, false);
  addAccountMeta(keys, signers, resolvedAccounts.compressionProgram, false);
  addAccountMeta(keys, signers, resolvedAccounts.systemProgram, false);

  // Data.
  const data =
    getCancelRedeemInstructionDataSerializer().serialize(resolvedArgs);

  // Bytes Created On Chain.
  const bytesCreatedOnChain = 0;

  return transactionBuilder([
    { instruction: { keys, programId, data }, signers, bytesCreatedOnChain },
  ]);
}
