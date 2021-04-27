import { text, relationship } from '@keystone-next/fields';
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
      ref: 'Product.variants',
    }),
    name: text({ isRequired: true }),
    description: text({
      ui: {
        displayMode: 'textarea',
      },
    }),
    // image: relationship({
    //   ref: 'ProductImage.variant',
    //   ui: {
    //     displayMode: 'cards',
    //     cardFields: ['image', 'altText'],
    //     inlineCreate: { fields: ['image', 'altText'] },
    //     inlineEdit: { fields: ['image', 'altText'] },
    //   },
    // }),
    // TODO: add variation inventory item for unique price, shipping, and inventory for each item
    // inventoryItem: relationship({
    //   ref: 'InventoryItem.variant',
    //   ui: {
    //     displayMode: 'cards',
    //     cardFields: ['price', 'requiresShipping', 'tracked', 'quantity'],
    //     inlineCreate: {
    //       fields: ['price', 'requiresShipping', 'tracked', 'quantity'],
    //     },
    //     inlineEdit: {
    //       fields: ['price', 'requiresShipping', 'tracked', 'quantity'],
    //     },
    //     inlineConnect: true,
    //   },
    // }),
  },
  ui: {
    listView: {
      initialColumns: ['name', 'product', 'variantType'],
    },
  },
});
