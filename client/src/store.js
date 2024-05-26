import create from "zustand";

const useStore = create((set) => ({
  imagePath: "",
  setImagePath: (path) => set({ imagePath: path }),
  getImagePath: () => set((state) => state.imagePath),
}));

export default useStore;
