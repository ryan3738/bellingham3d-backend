
import { createAuth } from '@keystone-6/auth';
import { config } from '@keystone-6/core';
import { statelessSessions } from '@keystone-6/core/session';
import { Download } from './schemas/Download';
import { permissionsList } from './schemas/fields';
import { Role } from './schemas/Role';
import { OrderItem } from './schemas/OrderItem';
import { Order } from './schemas/Order';
import { CartItem } from './schemas/CartItem';
import { ProductImage } from './schemas/ProductImage';
import { Product } from './schemas/Product';
import { User } from './schemas/User';
import { CustomerAddress } from './schemas/CustomerAddress';
import { InventoryItem } from './schemas/InventoryItem';
import { Option } from './schemas/Option';
import { Variant } from './schemas/Variant';
import { Category } from './schemas/Category';
import 'dotenv/config';
import { insertSeedData } from './seed-data';
import { sendPasswordResetEmail, sendMagicAuthEmail } from './lib/mail';
import { extendGraphqlSchema } from './mutations';


const THIRTY_DAYS = 60 * 60 * 24 * 30;
const databaseURL = process.env.DATABASE_URL;

const sessionConfig = {
  maxAge: THIRTY_DAYS, // How long they stay signed in?
  secret: process.env.COOKIE_SECRET || 'this secret should only be used in testing',
};

const { withAuth } = createAuth({
  // Required options
  listKey: 'User',
  identityField: 'email',
  secretField: 'password',
  // Additional options
  initFirstItem: {
    fields: ['name', 'email', 'password'],
    // TODO: Add in inital roles here
  },
  passwordResetLink: {
    async sendToken(args) {
      // send the email
      await sendPasswordResetEmail(args.token, args.identity);
    },
  },
  magicAuthLink: {
    sendToken: async (args) => {
      await sendMagicAuthEmail(args.token, args.identity); },
      tokensValidForMins: 60,
    },
  sessionData: `id name email role { ${permissionsList.join(' ')} }`,
});

export default withAuth(
  config({
    server: {
      cors: {
        origin: [process.env.FRONTEND_URL, process.env.FRONTEND_IP, process.env.APOLLO_STUDIO],
        credentials: true,
      },
      healthCheck: {
        path: '/my-health-check',
        data: { status: 'healthy' },
      },
      maxFileSize: 20000000,
    },
    db: process.env.DATABASE_URL
      ? {
          provider: 'postgresql',
          url: process.env.DATABASE_URL,
          async onConnect(keystone) {
            console.log('Connected to the database!');
            if (process.argv.includes('--seed-data')) {
              await insertSeedData(keystone);
            }
          },
        }
      : {
          provider: 'sqlite',
          url: databaseURL,
          async onConnect(keystone) {
            console.log('Connected to the database!');
            if (process.argv.includes('--seed-data')) {
              await insertSeedData(keystone);
            }
          },
        },
    graphql: {
      cors: {
        origin: [process.env.FRONTEND_URL, process.env.FRONTEND_IP, process.env.APOLLO_STUDIO],
        credentials: true,
      },
      apolloConfig: {
        introspection: true,
      },
      queryLimits: {
        maxTotalResults: 100,
      },
    },
    lists: {
      // Schema items go in here
      User,
      Product,
      ProductImage,
      Download,
      CartItem,
      OrderItem,
      Order,
      Option,
      Variant,
      InventoryItem,
      CustomerAddress,
      Category,
      Role,
    },
    files: {
      upload: 'local',
      local: {
        storagePath: 'public/files',
        baseUrl: '/files',
      },
    },
    extendGraphqlSchema,
    ui: {
      // Show the UI only for poeple who pass this test
      isAccessAllowed: ({ session }) => session?.data,
    },
    session: statelessSessions(sessionConfig),
  }),
);
