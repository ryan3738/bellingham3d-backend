import { list } from '@keystone-next/keystone/schema';
import {
  text,
  password,
  relationship,
  timestamp,
} from '@keystone-next/fields';
import { permissions, rules } from '../access';

export const User = list({
  access: {
    create: () => true,
    read: rules.canManageUsers,
    update: rules.canManageUsers,
    // Only people with the permission can delete themselves!
    // You can't delete yourself
    delete: permissions.canManageUsers,
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
    name: text({ isRequired: true }),
    email: text({ isRequired: true, isUnique: true }),
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
      defaultValue: JSON.stringify(Date.now()),
      ui: {
        createView: { fieldMode: 'hidden' },
        itemView: { fieldMode: 'read' },
      },
    }),
  },
});
