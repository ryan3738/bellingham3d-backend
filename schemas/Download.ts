import 'dotenv/config';
import { file, text, timestamp } from '@keystone-6/core/fields';
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
        createdAt: timestamp({
            // TODO: Change to resolveInput hook
            // defaultValue: getToday(),
            ui: {
                createView: { fieldMode: 'hidden' },
                itemView: { fieldMode: 'read' },
            },
            isOrderable: true,
        }),
    },
    ui: {
        listView: {
            initialColumns: ['file', 'title', 'createdAt'],
        },
    },
});
