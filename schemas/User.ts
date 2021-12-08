import { list } from '@keystone-next/keystone';
import {
  text,
  password,
  relationship,
  timestamp,
} from '@keystone-next/keystone/fields';
import { permissions, rules } from '../access';
import { getToday } from '../lib/dates';

export const User = list({
  access: {
    operation: {
      create: () => true,
      // only people with the permission can delete themselves!
      // You can't delete yourself
      delete: permissions.canManageUsers,
    },
    filter: {
      query: rules.canManageUsers,
      update: rules.canManageUsers,
    },
  },
  ui: {
    // hide the backend UI from regular users
    hideCreate: (args) => !permissions.canManageUsers(args),
    hideDelete: (args) => !permissions.canManageUsers(args),
    listView: {
      initialColumns: ['name', 'email', 'role'],
    },
  },
  fields: {
    name: text({ validation: { isRequired: true } }),
    email: text({ validation: { isRequired: true, }, isIndexed: 'unique', isFilterable: true }),
    password: password(),
    addresses: relationship({
      ref: 'CustomerAddress.user',
      many: true,
    }),
    defaultShipping: relationship({
      ref: 'CustomerAddress.isDefaultShipping',
    }),
    defaultBilling: relationship({
      ref: 'CustomerAddress.isDefaultBilling',
    }),
    cart: relationship({
      ref: 'CartItem.user',
      many: true,
      ui: {
        createView: { fieldMode: 'hidden' },
        itemView: { fieldMode: 'read' },
      },
    }),
    orders: relationship({
      ref: 'Order.user',
      many: true,
      ui: {
        createView: { fieldMode: 'hidden' },
        itemView: { fieldMode: 'read' },
      },
    }),
    role: relationship({
      ref: 'Role.assignedTo',
      // add access control to an individual field
      access: {
        create: permissions.canManageUsers,
        update: permissions.canManageUsers,
      },
    }),
    products: relationship({
      ref: 'Product.user',
      many: true,
      ui: {
        createView: { fieldMode: 'hidden' },
        itemView: { fieldMode: 'read' },
      },
    }),
    createdAt: timestamp({
      // TODO: Change to resolveInput hook
      defaultValue: getToday(),
      ui: {
        createView: { fieldMode: 'hidden' },
        itemView: { fieldMode: 'read' },
      },
    }),
  },
});
