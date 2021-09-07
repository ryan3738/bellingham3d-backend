import { list } from '@keystone-next/keystone';
import { text, relationship } from '@keystone-next/keystone/fields';
import { rules, permissions } from '../access';
import 'dotenv/config';

export const VariantType = list({
  access: {
    operation: {
      create: permissions.canManageProducts,
    },
    filter: {
      query: rules.canReadProducts,
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
    variant: relationship({
      ref: 'Variant.variantType',
      many: true,
    }),
  },
  ui: {
    listView: {
      initialColumns: ['name', 'description'],
    },
  },
});
