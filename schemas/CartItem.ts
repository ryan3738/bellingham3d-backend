import {
  integer,
  relationship,
  timestamp,
  checkbox,
} from '@keystone-next/keystone/fields';
import { list } from '@keystone-next/keystone/schema';
import { rules, isSignedIn } from '../access';

export const CartItem = list({
  access: {
    create: isSignedIn,
    read: rules.canOrder,
    update: rules.canOrder,
    delete: rules.canOrder,
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
      isRequired: true,
    }),
    product: relationship({ ref: 'Product' }),
    variants: relationship({
      ref: 'Variant',
      many: true,
    }),
    saveForLater: checkbox({ defaultValue: false }),
    createdAt: timestamp({
      defaultValue: JSON.stringify(Date.now()),
      ui: {
        createView: { fieldMode: 'hidden' },
        itemView: { fieldMode: 'read' },
      },
    }),
    user: relationship({ ref: 'User.cart' }),
  },
});
