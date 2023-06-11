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
  PublicKey,
  Serializer,
  Signer,
  TransactionBuilder,
  mapSerializer,
  transactionBuilder,
} from '@metaplex-foundation/umi';
import { addObjectProperty, isWritable } from '../shared';

// Accounts.
export type ReplaceLeafInstructionAccounts = {
  merkleTree: PublicKey;
  authority?: Signer;
  noop: PublicKey;
};

// Data.
export type ReplaceLeafInstructionData = {
  discriminator: Array<number>;
  root: Uint8Array;
  previousLeaf: Uint8Array;
  newLeaf: Uint8Array;
  index: number;
};

export type ReplaceLeafInstructionDataArgs = {
  root: Uint8Array;
  previousLeaf: Uint8Array;
  newLeaf: Uint8Array;
  index: number;
};

export function getReplaceLeafInstructionDataSerializer(
  context: Pick<Context, 'serializer'>
): Serializer<ReplaceLeafInstructionDataArgs, ReplaceLeafInstructionData> {
  const s = context.serializer;
  return mapSerializer<
    ReplaceLeafInstructionDataArgs,
    any,
    ReplaceLeafInstructionData
  >(
    s.struct<ReplaceLeafInstructionData>(
      [
        ['discriminator', s.array(s.u8(), { size: 8 })],
        ['root', s.bytes({ size: 32 })],
        ['previousLeaf', s.bytes({ size: 32 })],
        ['newLeaf', s.bytes({ size: 32 })],
        ['index', s.u32()],
      ],
      { description: 'ReplaceLeafInstructionData' }
    ),
    (value) => ({
      ...value,
      discriminator: [204, 165, 76, 100, 73, 147, 0, 128],
    })
  ) as Serializer<ReplaceLeafInstructionDataArgs, ReplaceLeafInstructionData>;
}

// Args.
export type ReplaceLeafInstructionArgs = ReplaceLeafInstructionDataArgs;

// Instruction.
export function replaceLeaf(
  context: Pick<Context, 'serializer' | 'programs' | 'identity'>,
  input: ReplaceLeafInstructionAccounts & ReplaceLeafInstructionArgs
): TransactionBuilder {
  const signers: Signer[] = [];
  const keys: AccountMeta[] = [];

  // Program ID.
  const programId = {
    ...context.programs.getPublicKey(
      'splAccountCompression',
      'cmtDvXumGCrqC1Age74AVPhSRVXJMd8PJS91L8KbNCK'
    ),
    isWritable: false,
  };

  // Resolved inputs.
  const resolvingAccounts = {};
  const resolvingArgs = {};
  addObjectProperty(
    resolvingAccounts,
    'authority',
    input.authority ?? context.identity
  );
  const resolvedAccounts = { ...input, ...resolvingAccounts };
  const resolvedArgs = { ...input, ...resolvingArgs };

  // Merkle Tree.
  keys.push({
    pubkey: resolvedAccounts.merkleTree,
    isSigner: false,
    isWritable: isWritable(resolvedAccounts.merkleTree, true),
  });

  // Authority.
  signers.push(resolvedAccounts.authority);
  keys.push({
    pubkey: resolvedAccounts.authority.publicKey,
    isSigner: true,
    isWritable: isWritable(resolvedAccounts.authority, false),
  });

  // Noop.
  keys.push({
    pubkey: resolvedAccounts.noop,
    isSigner: false,
    isWritable: isWritable(resolvedAccounts.noop, false),
  });

  // Data.
  const data =
    getReplaceLeafInstructionDataSerializer(context).serialize(resolvedArgs);

  // Bytes Created On Chain.
  const bytesCreatedOnChain = 0;

  return transactionBuilder([
    { instruction: { keys, programId, data }, signers, bytesCreatedOnChain },
  ]);
}
