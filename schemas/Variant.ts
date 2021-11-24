import { text, relationship } from '@keystone-next/keystone/fields';
import { list } from '@keystone-next/keystone';
import { rules, permissions } from '../access';
import { getRegularOption } from '../lib/defaults';

export const Variant = list({
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
    option: relationship({
      ref: 'Option.variants',
      defaultValue: async ({ context }) => await getRegularOption({ context }),
      isFilterable: true,
    }),
    product: relationship({
      ref: 'Product.variants',
    }),
    name: text({ validation: { isRequired: true, }, defaultValue: 'Regular', isFilterable: true }),
    description: text({
      validation: { isRequired: false, },
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
      initialColumns: ['name', 'product', 'option'],
    },
  },
});
