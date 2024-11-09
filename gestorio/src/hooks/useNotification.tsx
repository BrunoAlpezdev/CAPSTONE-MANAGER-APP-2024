import { use, useState } from 'react'

type Notification = string

export function useNotifications() {
	const [notifications, setNotifications] = useState<Notification[]>([])

	const addNotification = (message: Notification) => {
		setNotifications((prevNotifications) => [...prevNotifications, message])
	}

	return {
		notifications,
		addNotification
	}
}
