/**
 * This code was AUTOGENERATED using the kinobi library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun kinobi to update it.
 *
 * @see https://github.com/metaplex-foundation/kinobi
 */

import {
  Account,
  Context,
  Pda,
  PublicKey,
  RpcAccount,
  RpcGetAccountOptions,
  RpcGetAccountsOptions,
  assertAccountExists,
  deserializeAccount,
  gpaBuilder,
  publicKey as toPublicKey,
} from '@metaplex-foundation/umi';
import {
  Serializer,
  array,
  mapSerializer,
  publicKey as publicKeySerializer,
  string,
  struct,
  u32,
  u64,
  u8,
} from '@metaplex-foundation/umi/serializers';
import { LeafSchema, LeafSchemaArgs, getLeafSchemaSerializer } from '../types';

export type Voucher = Account<VoucherAccountData>;

export type VoucherAccountData = {
  discriminator: Array<number>;
  leafSchema: LeafSchema;
  index: number;
  merkleTree: PublicKey;
};

export type VoucherAccountDataArgs = {
  leafSchema: LeafSchemaArgs;
  index: number;
  merkleTree: PublicKey;
};

export function getVoucherAccountDataSerializer(): Serializer<
  VoucherAccountDataArgs,
  VoucherAccountData
> {
  return mapSerializer<VoucherAccountDataArgs, any, VoucherAccountData>(
    struct<VoucherAccountData>(
      [
        ['discriminator', array(u8(), { size: 8 })],
        ['leafSchema', getLeafSchemaSerializer()],
        ['index', u32()],
        ['merkleTree', publicKeySerializer()],
      ],
      { description: 'VoucherAccountData' }
    ),
    (value) => ({
      ...value,
      discriminator: [191, 204, 149, 234, 213, 165, 13, 65],
    })
  ) as Serializer<VoucherAccountDataArgs, VoucherAccountData>;
}

export function deserializeVoucher(rawAccount: RpcAccount): Voucher {
  return deserializeAccount(rawAccount, getVoucherAccountDataSerializer());
}

export async function fetchVoucher(
  context: Pick<Context, 'rpc'>,
  publicKey: PublicKey | Pda,
  options?: RpcGetAccountOptions
): Promise<Voucher> {
  const maybeAccount = await context.rpc.getAccount(
    toPublicKey(publicKey, false),
    options
  );
  assertAccountExists(maybeAccount, 'Voucher');
  return deserializeVoucher(maybeAccount);
}

export async function safeFetchVoucher(
  context: Pick<Context, 'rpc'>,
  publicKey: PublicKey | Pda,
  options?: RpcGetAccountOptions
): Promise<Voucher | null> {
  const maybeAccount = await context.rpc.getAccount(
    toPublicKey(publicKey, false),
    options
  );
  return maybeAccount.exists ? deserializeVoucher(maybeAccount) : null;
}

export async function fetchAllVoucher(
  context: Pick<Context, 'rpc'>,
  publicKeys: Array<PublicKey | Pda>,
  options?: RpcGetAccountsOptions
): Promise<Voucher[]> {
  const maybeAccounts = await context.rpc.getAccounts(
    publicKeys.map((key) => toPublicKey(key, false)),
    options
  );
  return maybeAccounts.map((maybeAccount) => {
    assertAccountExists(maybeAccount, 'Voucher');
    return deserializeVoucher(maybeAccount);
  });
}

export async function safeFetchAllVoucher(
  context: Pick<Context, 'rpc'>,
  publicKeys: Array<PublicKey | Pda>,
  options?: RpcGetAccountsOptions
): Promise<Voucher[]> {
  const maybeAccounts = await context.rpc.getAccounts(
    publicKeys.map((key) => toPublicKey(key, false)),
    options
  );
  return maybeAccounts
    .filter((maybeAccount) => maybeAccount.exists)
    .map((maybeAccount) => deserializeVoucher(maybeAccount as RpcAccount));
}

export function getVoucherGpaBuilder(
  context: Pick<Context, 'rpc' | 'programs'>
) {
  const programId = context.programs.getPublicKey(
    'primitivesProtractor',
    'graphmieBkazqwUYt9HJZz5FZmGVngPcrRwCZ4PWGGE'
  );
  return gpaBuilder(context, programId)
    .registerFields<{
      discriminator: Array<number>;
      leafSchema: LeafSchemaArgs;
      index: number;
      merkleTree: PublicKey;
    }>({
      discriminator: [0, array(u8(), { size: 8 })],
      leafSchema: [8, getLeafSchemaSerializer()],
      index: [177, u32()],
      merkleTree: [181, publicKeySerializer()],
    })
    .deserializeUsing<Voucher>((account) => deserializeVoucher(account))
    .whereField('discriminator', [191, 204, 149, 234, 213, 165, 13, 65]);
}

export function getVoucherSize(): number {
  return 213;
}

export function findVoucherPda(
  context: Pick<Context, 'eddsa' | 'programs'>,
  seeds: {
    merkleTree: PublicKey;

    nonce: number | bigint;
  }
): Pda {
  const programId = context.programs.getPublicKey(
    'primitivesProtractor',
    'graphmieBkazqwUYt9HJZz5FZmGVngPcrRwCZ4PWGGE'
  );
  return context.eddsa.findPda(programId, [
    string({ size: 'variable' }).serialize('voucher'),
    publicKeySerializer().serialize(seeds.merkleTree),
    u64().serialize(seeds.nonce),
  ]);
}

export async function fetchVoucherFromSeeds(
  context: Pick<Context, 'eddsa' | 'programs' | 'rpc'>,
  seeds: Parameters<typeof findVoucherPda>[1],
  options?: RpcGetAccountOptions
): Promise<Voucher> {
  return fetchVoucher(context, findVoucherPda(context, seeds), options);
}

export async function safeFetchVoucherFromSeeds(
  context: Pick<Context, 'eddsa' | 'programs' | 'rpc'>,
  seeds: Parameters<typeof findVoucherPda>[1],
  options?: RpcGetAccountOptions
): Promise<Voucher | null> {
  return safeFetchVoucher(context, findVoucherPda(context, seeds), options);
}
