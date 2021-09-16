const getInventoryItem = async ({ context }) => {
    const defaultItem = await context.lists.InventoryItem.createOne({
        data: {
            price: 0,
            requiresShipping: false,
            tracked: false,
            quantity: 0,
            allowBackorder: false,
        },
    });
    if (defaultItem.id) {
        return { connect: { id: defaultItem.id } };
    }
};

const getRegularOption = async ( { context } ) => {
    const regularOption = await context.lists.Option.findMany({
        where: { name: { equals: 'Regular' } },
        query: 'id'
    });
    if (regularOption.id) {
        return { connect: { id: regularOption.id } };
    }
};

export { getInventoryItem, getRegularOption };