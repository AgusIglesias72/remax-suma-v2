
// hooks/use-notifications.ts (opcional - para manejo de estado global)
"use client"

import { useState, useEffect } from 'react'
import { mockNotifications, type NotificationType } from '@/lib/notifications-data'

export function useNotifications() {
  const [notifications, setNotifications] = useState<NotificationType[]>(mockNotifications)
  const [loading, setLoading] = useState(false)

  const unreadCount = notifications.filter(n => !n.read).length
  const actionRequiredCount = notifications.filter(n => n.actionRequired && !n.read).length

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    )
  }

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const addNotification = (notification: Omit<NotificationType, 'id'>) => {
    const newNotification: NotificationType = {
      ...notification,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    }
    setNotifications(prev => [newNotification, ...prev])
  }

  return {
    notifications,
    unreadCount,
    actionRequiredCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    addNotification
  }
}