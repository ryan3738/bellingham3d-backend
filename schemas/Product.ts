import { integer, select, text, relationship } from '@keystone-next/fields';
import { list } from '@keystone-next/keystone/schema';
import { InventoryItem } from './InventoryItem';
import { permissionFields } from './fields';
import { rules } from '../access';

export const Product = list({
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
    image: relationship({
      ref: 'ProductImage.product',
      ui: {
        displayMode: 'cards',
        cardFields: ['image', 'altText'],
        inlineCreate: { fields: ['image', 'altText'] },
        inlineEdit: { fields: ['image', 'altText'] },
        inlineConnect: true,
      },
      many: true,
    }),
    status: select({
      options: [
        { label: 'Draft', value: 'DRAFT' },
        { label: 'Available', value: 'AVAILABLE' },
        { label: 'Unavailable', value: 'UNAVAILABLE' },
      ],
      defaultValue: 'DRAFT',
      ui: {
        displayMode: 'segmented-control',
        createView: { fieldMode: 'hidden' },
      },
    }),
    price: integer({ defaultValue: 0 }),
    category: relationship({
      ref: 'Category.product',
      many: true,
    }),
    inventoryItem: relationship({
      ref: 'InventoryItem.product',
      defaultValue: { create: InventoryItem },
      ui: {
        displayMode: 'cards',
        cardFields: [
          'price',
          'requiresShipping',
          'tracked',
          'quantity',
          'allowBackorder',
        ],
        // inlineCreate: {
        //   fields: [
        //     'price',
        //     'requiresShipping',
        //     'tracked',
        //     'quantity',
        //     'allowBackorder',
        //   ],
        // },
        inlineEdit: {
          fields: [
            'price',
            'requiresShipping',
            'tracked',
            'quantity',
            'allowBackorder',
          ],
        },
        inlineConnect: false,
        removeMode: 'none',
      },
      // many: false,
    }),
    variants: relationship({
      ref: 'Variant.product',
      ui: {
        displayMode: 'cards',
        cardFields: ['variantType', 'name'],
        inlineCreate: {
          fields: ['variantType', 'name'],
        },
        inlineEdit: { fields: ['variantType', 'name'] },
        inlineConnect: true,
      },
      many: true,
    }),
    user: relationship({
      ref: 'User.products',
      defaultValue: ({ context }) => ({
        connect: { id: context.session.itemId },
      }),
    }),
  },
  ui: {
    listView: {
      initialColumns: ['name', 'status', 'category', 'price'],
    },
  },
});
