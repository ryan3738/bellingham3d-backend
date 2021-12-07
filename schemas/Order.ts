import { integer, text, relationship, timestamp, virtual } from '@keystone-next/keystone/fields';
import { graphql, list } from '@keystone-next/keystone';
import { isSignedIn, rules } from '../access';
import { getToday } from '../lib/dates';
import formatMoney from '../lib/formatMoney';

export const Order = list({
  access: {
    operation: {
      create: isSignedIn,
      update: () => false,
      delete: () => false,
    },
    filter: { query: rules.canOrder },
  },
  fields: {
    // Create a custom label for database items
    // label: virtual({
    //   graphQLReturnType: 'String',
    //   resolver(item) {
    //     return `Wes is cool ${formatMoney(item.total)}`;
    //   },
    // }),
    label: virtual({
      field: graphql.field({
        type: graphql.String,
        resolve(item) {
          return `${formatMoney((item as any).total)}`;
        },
      }),
    }),
    total: integer(),
    items: relationship({ ref: 'OrderItem.order', many: true }),
    user: relationship({ ref: 'User.orders' }),
    charge: text(),
    shippingAddress: relationship({
      ref: 'CustomerAddress.orderShippingAddress',
    }),
    createdAt: timestamp({
      defaultValue: getToday(),
      ui: {
        createView: { fieldMode: 'hidden' },
        itemView: { fieldMode: 'read' },
      },
    }),
  },
  ui: {
    listView: {
      initialColumns: ['charge', 'user', 'total', 'createdAt', 'items'],
    },
  },
});
