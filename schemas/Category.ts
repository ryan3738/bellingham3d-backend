
import { list } from '@keystone-6/core';
import { text, relationship } from '@keystone-6/core/fields';
import { rules, isSignedIn } from '../access';
import 'dotenv/config';

export const Category = list({
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
    name: text({ validation: { isRequired: true } }),
    description: text({
      ui: {
        displayMode: 'textarea',
      },
    }),
    product: relationship({
      ref: 'Product.category',
      many: true,
    }),
  },
  ui: {
    listView: {
      initialColumns: ['name', 'description', 'product'],
    },
  },
});
