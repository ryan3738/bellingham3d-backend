import { integer, select, text, relationship } from '@keystone-next/fields';
import { list } from '@keystone-next/keystone/schema';
import { User } from './User';

export const CartItem = list({
  ui: {
    listView: {
      initialColumns: ['product', 'quantity', 'user'],
    },
  },
  // TODO
  // access:
  fields: {
    // TODO: Custom Lable in here
    quantity: integer({
      defaultValue: 1,
      isRequired: true,
    }),
    product: relationship({ ref: 'Product' }),
    user: relationship({ ref: 'User.cart' }),
  },
});
