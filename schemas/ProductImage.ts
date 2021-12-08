import 'dotenv/config';
import { relationship, text, timestamp } from '@keystone-next/keystone/fields';
import { list } from '@keystone-next/keystone';
import { cloudinaryImage } from '@keystone-next/cloudinary';
import { isSignedIn, permissions } from '../access';
import { getToday } from '../lib/dates';

export const cloudinary = {
  cloudName: process.env.CLOUDINARY_CLOUD_NAME || 'fake',
  apiKey: process.env.CLOUDINARY_KEY || 'fake',
  apiSecret: process.env.CLOUDINARY_SECRET || 'fake',
  folder: 'bellingham-3d',
  upload_preset: 'bellingham-3d',
};

export const ProductImage = list({
  access: {
    operation: {
      create: isSignedIn,
      query: () => true,
      update: permissions.canManageProducts,
      delete: permissions.canManageProducts,
    },
  },
  fields: {
    image: cloudinaryImage({
      cloudinary,
      label: 'Source',
    }),
    altText: text({ validation: { isRequired: false, }, }),
    createdAt: timestamp({
      // TODO: Change to resolveInput hook
      defaultValue: getToday(),
      ui: {
        createView: { fieldMode: 'hidden' },
        itemView: { fieldMode: 'read' },
      },
      isOrderable: true,
    }),
    product: relationship({ ref: 'Product.images', many: true }),
    // variant: relationship({ ref: 'Variant.image', many: true }),
  },
  ui: {
    listView: {
      initialColumns: ['image', 'altText', 'product'],
    },
  },
});
