const getToday = () => {
    const date = Date.now();
    const today = new Date(date);
    return today.toISOString();
};

export { getToday };