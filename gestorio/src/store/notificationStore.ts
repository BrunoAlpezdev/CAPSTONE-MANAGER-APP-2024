import { create } from 'zustand'

type Notification = string

interface NotificationStore {
	notifications: Notification[]
	addNotification: (message: Notification) => void
}

export const useNotificationStore = create<NotificationStore>((set) => ({
	notifications: [],
	addNotification: (message) =>
		set((state) => ({ notifications: [...state.notifications, message] }))
}))
