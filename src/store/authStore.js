import { create } from 'zustand';


const useAppStore = create(set => ({
  notificationCount: 0,
  setNotificationCount: n => set({ notificationCount: n }),
}));

export default useAppStore;
