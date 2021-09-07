import { text, relationship, timestamp } from '@keystone-next/keystone/fields';
import { list } from '@keystone-next/keystone';
import { isSignedIn, rules } from '../access';

export const CustomerAddress = list({
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
  fields: {
    // label: virtual({
    //   resolver: (name, args) => {
    //     console.log('lastName', args.lastName);
    //     return JSON.stringify(`${name.name} ${args.lastName.name}`);
    //   },
    //   graphQLReturnType: 'String',
    //   args: [{ lastName: 'lastName', type: 'String' }],
    // }),
    firstName: text({ isRequired: true }),
    lastName: text(),
    company: text(),
    address1: text({ isRequired: true }),
    address2: text(),
    city: text({ isRequired: true }),
    region: text({ isRequired: true }),
    country: text({ isRequired: true }),
    zip: text({ isRequired: true }),
    phone: text(),
    createdAt: timestamp({
      defaultValue: JSON.stringify(Date.now()),
      ui: {
        createView: { fieldMode: 'hidden' },
        itemView: { fieldMode: 'read' },
      },
    }),
    user: relationship({
      ref: 'User.addresses',
      defaultValue: ({ context }) => ({
        connect: { id: context.session.itemId },
      }),
    }),
    isDefaultShipping: relationship({ ref: 'User.defaultShipping' }),
    isDefaultBilling: relationship({ ref: 'User.defaultBilling' }),
    orderShippingAddress: relationship({
      ref: 'Order.shippingAddress',
      many: true,
    }),
  },
  ui: {
    listView: {
      initialColumns: [
        'firstName',
        'lastName',
        'address1',
        'user',
        'isDefaultShipping',
        'isDefaultBilling',
      ],
    },
  },
});
