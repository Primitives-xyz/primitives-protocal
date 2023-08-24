/**
 * This code was AUTOGENERATED using the kinobi library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun kinobi to update it.
 *
 * @see https://github.com/metaplex-foundation/kinobi
 */

import { Serializer, scalarEnum } from '@metaplex-foundation/umi/serializers';

export enum InstructionName {
  Unknown,
  MintV1,
  Redeem,
  CancelRedeem,
  Transfer,
  Delegate,
  DecompressV1,
  Compress,
  Burn,
  CreateTree,
  VerifyCreator,
  UnverifyCreator,
  VerifyCollection,
  UnverifyCollection,
  SetAndVerifyCollection,
  MintToCollectionV1,
  SetDecompressionPermission,
  CreateTreeV2,
}

export type InstructionNameArgs = InstructionName;

/** @deprecated Use `getInstructionNameSerializer()` without any argument instead. */
export function getInstructionNameSerializer(
  _context: object
): Serializer<InstructionNameArgs, InstructionName>;
export function getInstructionNameSerializer(): Serializer<
  InstructionNameArgs,
  InstructionName
>;
export function getInstructionNameSerializer(
  _context: object = {}
): Serializer<InstructionNameArgs, InstructionName> {
  return scalarEnum<InstructionName>(InstructionName, {
    description: 'InstructionName',
  }) as Serializer<InstructionNameArgs, InstructionName>;
}
