import 'dotenv/config';
import { file, relationship, text, timestamp } from '@keystone-6/core/fields';
import { list } from '@keystone-6/core';
import { isSignedIn, permissions } from '../access';
// import { getToday } from '../lib/dates';


export const Download= list({
    access: {
        operation: {
            create: () => true,
            query: () => true,
            update: () => true,
            delete: () => true,
        },
    },
    fields: {
        title: text({ validation: { isRequired: false, }, }),
        file: file(),
        product: relationship({ ref: 'Product.downloads', many: true }),
        createdAt: timestamp({

            defaultValue: { kind: 'now' },
            ui: {
                createView: { fieldMode: 'hidden' },
                itemView: { fieldMode: 'read' },
            },
            isOrderable: true,
        }),
    },
    ui: {
        listView: {
            initialColumns: ['title', 'createdAt'],
        },
    },
});
