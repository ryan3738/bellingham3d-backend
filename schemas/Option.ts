import { list } from '@keystone-6/core';
import { text, relationship } from '@keystone-6/core/fields';
import { rules, permissions } from '../access';
import 'dotenv/config';

export const Option = list({
  access: {
    operation: {
      create: permissions.canManageProducts,
    },
    filter: {
      query: () => true,
      update: rules.canManageProducts,
      delete: rules.canManageProducts,
    },
  },
  fields: {
    name: text({
      validation: { isRequired: true, },
      isFilterable: true }),
    description: text({
      ui: {
        displayMode: 'textarea',
      },
    }),
    variants: relationship({
      ref: 'Variant.option',
      many: true,
    }),
  },
  ui: {
    listView: {
      initialColumns: ['name', 'description'],
    },
  },
});
