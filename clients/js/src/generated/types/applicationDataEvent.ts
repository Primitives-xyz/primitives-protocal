/**
 * This code was AUTOGENERATED using the kinobi library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun kinobi to update it.
 *
 * @see https://github.com/metaplex-foundation/kinobi
 */

import {
  Context,
  GetDataEnumKind,
  GetDataEnumKindContent,
  Serializer,
} from '@metaplex-foundation/umi';
import {
  ApplicationDataEventV1,
  ApplicationDataEventV1Args,
  getApplicationDataEventV1Serializer,
} from '.';

export type ApplicationDataEvent = {
  __kind: 'V1';
  fields: [ApplicationDataEventV1];
};

export type ApplicationDataEventArgs = {
  __kind: 'V1';
  fields: [ApplicationDataEventV1Args];
};

export function getApplicationDataEventSerializer(
  context: Pick<Context, 'serializer'>
): Serializer<ApplicationDataEventArgs, ApplicationDataEvent> {
  const s = context.serializer;
  return s.dataEnum<ApplicationDataEvent>(
    [
      [
        'V1',
        s.struct<GetDataEnumKindContent<ApplicationDataEvent, 'V1'>>([
          ['fields', s.tuple([getApplicationDataEventV1Serializer(context)])],
        ]),
      ],
    ],
    { description: 'ApplicationDataEvent' }
  ) as Serializer<ApplicationDataEventArgs, ApplicationDataEvent>;
}

// Data Enum Helpers.
export function applicationDataEvent(
  kind: 'V1',
  data: GetDataEnumKindContent<ApplicationDataEventArgs, 'V1'>['fields']
): GetDataEnumKind<ApplicationDataEventArgs, 'V1'>;
export function applicationDataEvent<
  K extends ApplicationDataEventArgs['__kind']
>(kind: K, data?: any): Extract<ApplicationDataEventArgs, { __kind: K }> {
  return Array.isArray(data)
    ? { __kind: kind, fields: data }
    : { __kind: kind, ...(data ?? {}) };
}
export function isApplicationDataEvent<
  K extends ApplicationDataEvent['__kind']
>(
  kind: K,
  value: ApplicationDataEvent
): value is ApplicationDataEvent & { __kind: K } {
  return value.__kind === kind;
}
