
import { list } from '@keystone-next/keystone';
import { text, relationship } from '@keystone-next/keystone/fields';
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
    name: text({ isRequired: true }),
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
