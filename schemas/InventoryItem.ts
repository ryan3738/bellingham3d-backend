import { integer, text, relationship, checkbox } from '@keystone-next/fields';
import { list } from '@keystone-next/keystone/schema';
import { Product } from './Product';
import { rules } from '../access';

export const InventoryItem = list({
  access: {
    create: rules.canManageProducts,
    read: () => true,
    update: rules.canManageProducts,
    delete: rules.canManageProducts,
  },
  fields: {
    price: integer({}),
    tracked: checkbox({ defaultValue: false }),
    quantity: integer(),
    requiresShipping: checkbox({ defaultValue: false }),
    product: relationship({
      ref: 'Product.inventoryItem',
    }),
  },
  ui: {
    listView: {
      initialColumns: [
        'product',
        'price',
        'tracked',
        'quantity',
        'requiresShipping',
      ],
    },
  },
});
