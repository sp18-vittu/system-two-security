declare const local: {
    clear: () => void;
    getItem: (item_name: string) => string | null;
    setItem: (itemName: string, value: any) => void;
};
export default local;
