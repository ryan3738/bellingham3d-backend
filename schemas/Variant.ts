import { integer, text, relationship } from '@keystone-next/fields';
import { list } from '@keystone-next/keystone/schema';
import { rules } from '../access';

export const Variant = list({
  access: {
    create: rules.canManageProducts,
    read: () => true,
    update: rules.canManageProducts,
    delete: rules.canManageProducts,
  },
  fields: {
    variantType: relationship({
      ref: 'VariantType.variant',
    }),
    product: relationship({
      ref: 'Product.variant',
    }),
    name: text({ isRequired: true }),
    description: text({
      ui: {
        displayMode: 'textarea',
      },
    }),
    image: relationship({
      ref: 'ProductImage.variant',
      ui: {
        displayMode: 'cards',
        cardFields: ['image', 'altText'],
        inlineCreate: { fields: ['image', 'altText'] },
        inlineEdit: { fields: ['image', 'altText'] },
      },
    }),
  },
  ui: {
    listView: {
      initialColumns: ['name', 'product', 'variantType'],
    },
  },
});
