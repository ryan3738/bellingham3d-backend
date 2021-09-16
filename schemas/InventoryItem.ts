import { integer, relationship, checkbox } from '@keystone-next/keystone/fields';
import { list } from '@keystone-next/keystone';
import { rules, isSignedIn } from '../access';

export const InventoryItem = list({
  access: {
    operation: {
      create: isSignedIn,
    },
    filter: {
      query: () => true,
      update: rules.canManageProducts,
      delete: rules.canManageProducts,
    },
  },
  fields: {
    price: integer({ defaultValue: 0 }),
    requiresShipping: checkbox({ defaultValue: false }),
    tracked: checkbox({ defaultValue: false }),
    quantity: integer({ defaultValue: 0 }),
    allowBackorder: checkbox({ defaultValue: false }),
    product: relationship({
      ref: 'Product.inventoryItem',
    }),
  },
  ui: {
    listView: {
      initialColumns: [
        'product',
        'price',
        'requiresShipping',
        'tracked',
        'quantity',
        'allowBackorder',
      ],
    },
  },
});
