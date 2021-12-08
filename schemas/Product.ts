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
// import { getInventoryItem } from '../lib/defaults';

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
    name: text({
      validation: { isRequired: true, },
      isFilterable: true }),
    description: text({
      ui: {
        displayMode: 'textarea',
      },
      isFilterable: true
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
      // TODO: Change to resolveInput hook
      // defaultValue: async ({ context }) => {
      //   return await getInventoryItem({ context });
      // },
      ui: {
        displayMode: 'cards',
        cardFields: [
          'price',
          'requiresShipping',
          'tracked',
          'quantity',
          'allowBackorder',
        ],
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
      isFilterable: true,
    }),
    createdAt: timestamp({
      // defaultValue: getToday(),
      ui: {
        createView: { fieldMode: 'hidden' },
        itemView: { fieldMode: 'read' },
      },
      isOrderable: true,
    }),
    user: relationship({
      ref: 'User.products',
      hooks: {
        resolveInput: async ({ operation, resolvedData, context }) => {
          // Default to the currently logged in user on create.
          if (operation === 'create' && !resolvedData.user && context.session?.itemId) {
            return { connect: { id: context.session?.itemId } };
          }
          return resolvedData.user;
        },
      },
    }),
  },
  ui: {
    listView: {
      initialColumns: ['name', 'status', 'category', 'price'],
    },
  },
});
