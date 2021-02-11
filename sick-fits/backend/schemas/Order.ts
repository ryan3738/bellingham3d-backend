import {
  integer,
  select,
  text,
  relationship,
  virtual,
} from '@keystone-next/fields';
import { list } from '@keystone-next/keystone/schema';
import formatMoney from '../lib/formatMoney';

export const Order = list({
  fields: {
    // Create a custom label for database items
    // label: virtual({
    //   graphQLReturnType: 'String',
    //   resolver(item) {
    //     return `Wes is cool ${formatMoney(item.total)}`;
    //   },
    // }),
    total: integer(),
    items: relationship({ ref: 'OrderItem.order', many: true }),
    user: relationship({ ref: 'User.orders' }),
    charge: text(),
  },
});
