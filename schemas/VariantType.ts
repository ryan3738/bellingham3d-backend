import { list } from '@keystone-next/keystone/schema';
import { text, relationship } from '@keystone-next/fields';
import { rules } from '../access';
import 'dotenv/config';

export const VariantType = list({
  access: {
    create: rules.canManageProducts,
    read: () => true,
    update: rules.canManageProducts,
    delete: rules.canManageProducts,
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
