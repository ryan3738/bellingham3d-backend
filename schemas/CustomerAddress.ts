import { text, relationship, timestamp } from '@keystone-next/keystone/fields';
import { list } from '@keystone-next/keystone';
import { isSignedIn, rules } from '../access';
// import { getToday } from '../lib/dates';

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
    firstName: text({ validation: { isRequired: true } }),
    lastName: text(),
    company: text(),
    address1: text({ validation: { isRequired: true } }),
    address2: text(),
    city: text({ validation: { isRequired: true } }),
    region: text({ validation: { isRequired: true } }),
    country: text({ validation: { isRequired: true } }),
    zip: text({ validation: { isRequired: true } }),
    phone: text(),
    createdAt: timestamp({
      // TODO: Change to resolveInput hook
      // defaultValue: getToday(),
      ui: {
        createView: { fieldMode: 'hidden' },
        itemView: { fieldMode: 'read' },
      },
    }),
    user: relationship({
      ref: 'User.addresses',
      hooks: {
        resolveInput: async ({ operation, resolvedData, context }) => {
          // Default to the currently logged in user on create.
          if (operation === 'create' && !resolvedData.user && context.session?.itemId) {
            return { connect: { id: context.session?.itemId } };
          }
          return resolvedData.user;
        },
      },
    }),
    isDefaultShipping: relationship({ ref: 'User.defaultShipping' }),
    isDefaultBilling: relationship({ ref: 'User.defaultBilling' }),
    orderShippingAddress: relationship({
      ref: 'Order.shippingAddress',
      many: true,
    }),
  },
  hooks: {
    resolveInput: ({ resolvedData }) => {
      // Ensure the address is capitalized
      console.log('resolvedData', resolvedData);
      for (const key in resolvedData) {
        if (typeof resolvedData[key] === 'string') {
          resolvedData[key] = resolvedData[key].toUpperCase();
        }
      }
      // We always return resolvedData from the resolveInput hook
      console.log('resolvedData', resolvedData);
      return resolvedData;
    }
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
