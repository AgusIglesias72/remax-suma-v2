
// components/notification-badge.tsx
// Componente para mostrar badge de notificaciones en otros lugares
"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { getUnreadNotifications } from "@/lib/notifications-data"

export function NotificationBadge({ className = "" }: { className?: string }) {
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    setUnreadCount(getUnreadNotifications().length)
  }, [])

  if (unreadCount === 0) return null

  return (
    <Badge className={`bg-red-600 text-white ${className}`}>
      {unreadCount > 9 ? '9+' : unreadCount}
    </Badge>
  )
}