import { list } from '@keystone-next/keystone/schema';
import { text, relationship } from '@keystone-next/fields';
import { cloudinaryImage } from '@keystone-next/cloudinary';
import { rules } from '../access';
import 'dotenv/config';

export const Category = list({
  access: {
    create: rules.canManageProducts,
    read: () => true,
    update: rules.canManageProducts,
    delete: rules.canManageProducts,
  },
  fields: {
    name: text({ isRequired: true }),
    product: relationship({
      ref: 'Product.category',
      many: true,
    }),
  },
  ui: {
    listView: {
      initialColumns: ['name', 'product'],
    },
  },
});
