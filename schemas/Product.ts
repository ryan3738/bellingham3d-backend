import {
  integer,
  select,
  text,
  relationship,
  timestamp,
} from '@keystone-next/keystone/fields';
import { list } from '@keystone-next/keystone';
import { rules, isSignedIn } from '../access';
import { getToday } from '../lib/dates';

export const Product = list({
  access: {
    operation: {
      create: isSignedIn,
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
    images: relationship({
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
      isFilterable: true
    }),
    price: integer({ defaultValue: 0 }),
    category: relationship({
      ref: 'Category.product',
      many: true,
      isFilterable: true,
    }),
    inventoryItem: relationship({
      ref: 'InventoryItem.product',
      defaultValue: async ({ context }) => {
        const defaultItem = await context.lists.InventoryItem.createOne({
          data: {
            price: 0,
            requiresShipping: false,
            tracked: false,
            quantity: 0,
            allowBackorder: false,
          }
        });
        console.log('defaultItem', defaultItem);
        if(defaultItem?.length > 0) {
        return { connect: { id: defaultItem[0].id } };
        }
      },
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
        cardFields: ['option', 'name'],
        inlineCreate: {
          fields: ['option', 'name'],
        },
        inlineEdit: { fields: ['option', 'name'] },
        inlineConnect: true,
      },
      many: true,
    }),
    createdAt: timestamp({
      defaultValue: getToday(),
      ui: {
        createView: { fieldMode: 'hidden' },
        itemView: { fieldMode: 'read' },
      },
      isOrderable: true,
    }),
    user: relationship({
      ref: 'User.products',
      defaultValue: ({ context }) =>
        context.session?.itemId ? { connect: { id: context.session?.itemId } } : null,
    }),
  },
  ui: {
    listView: {
      initialColumns: ['name', 'status', 'category', 'price'],
    },
  },
});
