import {
  integer,
  relationship,
  timestamp,
  checkbox,
} from '@keystone-6/core/fields';
import { list } from '@keystone-6/core';
import { rules, isSignedIn } from '../access';
// import { getToday } from '../lib/dates';

export const CartItem = list({
  access: {
    operation: {
      create: isSignedIn,
    },
    filter: {
      query: rules.canOrder,
      update: rules.canOrder,
      delete: rules.canOrder,
    },
  },
  ui: {
    listView: {
      initialColumns: ['product', 'variants', 'quantity', 'user'],
    },
  },
  // TODO
  // access:
  fields: {
    // TODO: Custom Label in here
    quantity: integer({
      defaultValue: 1,
      validation: { isRequired: true, },
    }),
    product: relationship({ ref: 'Product', isFilterable: true }),
    variants: relationship({
      ref: 'Variant',
      many: true,
      isFilterable: true,
    }),
    saveForLater: checkbox({ defaultValue: false }),
    createdAt: timestamp({

      defaultValue: { kind: 'now' },
      ui: {
        createView: { fieldMode: 'hidden' },
        itemView: { fieldMode: 'read' },
      },
    }),
    user: relationship({ ref: 'User.cart', isFilterable: true }),
  },
});
