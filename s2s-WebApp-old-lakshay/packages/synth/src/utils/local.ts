const { window } = globalThis;

const local = {
  clear: () => {
    const { localStorage } = window;

    localStorage.clear();
  },
  getItem: (item_name: string) => {
    const { localStorage } = window;

    return localStorage.getItem(`SYNTH::${item_name}`);
  },
  setItem: (itemName: string, value: any) => {
    const { localStorage } = window;

    return localStorage.setItem(`SYNTH::${itemName}`, value);
  },
};

export default local;
