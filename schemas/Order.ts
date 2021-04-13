import { integer, text, relationship } from '@keystone-next/fields';
import { list } from '@keystone-next/keystone/schema';
import { isSignedIn, rules } from '../access';

export const Order = list({
  access: {
    create: isSignedIn,
    read: rules.canOrder,
    update: () => false,
    delete: () => false,
  },
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
