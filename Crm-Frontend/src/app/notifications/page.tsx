'use client'

import { useEffect, useState } from 'react'
import { Bell, MessageCircle, Mail, Smartphone, Send, CheckCircle, XCircle, Clock } from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Loader from '@/components/ui/Loader'
import { formatDate } from '@/utils/helpers'
import api from '@/lib/api'
import type { Notification } from '@/types'

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [typeFilter, setTypeFilter] = useState('all')
  const [channelFilter, setChannelFilter] = useState('all')

  useEffect(() => { fetchNotifications() }, [typeFilter, channelFilter])

  const fetchNotifications = async () => {
    try {
      let params = '?'
      if (typeFilter !== 'all') params += `type=${typeFilter}&`
      if (channelFilter !== 'all') params += `channel=${channelFilter}&`
      const res = await api.get(`/notifications${params}`)
      setNotifications(res.data.data || res.data || [])
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const sendBulkNotification = async (type: string) => {
    try {
      await api.post('/notifications/bulk', { type })
      alert('Notifications sent successfully!')
      fetchNotifications()
    } catch (error) {
      alert('Failed to send notifications')
    }
  }

  if (loading) return <div className="flex items-center justify-center h-96"><Loader size="lg" /></div>

  const stats = {
    total: notifications.length,
    sent: notifications.filter(n => n.status === 'sent').length,
    pending: notifications.filter(n => n.status === 'pending').length,
    failed: notifications.filter(n => n.status === 'failed').length,
  }

  const channelIcons: Record<string, any> = {
    whatsapp: MessageCircle,
    sms: Smartphone,
    email: Mail,
    push: Bell,
  }

  const channelColors: Record<string, string> = {
    whatsapp: 'text-emerald-600',
    sms: 'text-blue-600',
    email: 'text-violet-600',
    push: 'text-amber-600',
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Notifications</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage customer communications</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => sendBulkNotification('reminder')}>
            <Bell size={20} className="mr-2" />
            Send Reminders
          </Button>
          <Button onClick={() => sendBulkNotification('birthday')}>
            <Send size={20} className="mr-2" />
            Birthday Wishes
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <div className="text-3xl font-bold text-gray-900 dark:text-white">{stats.total}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total</div>
        </Card>
        <Card className="text-center">
          <div className="text-3xl font-bold text-emerald-600">{stats.sent}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Sent</div>
        </Card>
        <Card className="text-center">
          <div className="text-3xl font-bold text-amber-600">{stats.pending}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Pending</div>
        </Card>
        <Card className="text-center">
          <div className="text-3xl font-bold text-red-600">{stats.failed}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Failed</div>
        </Card>
      </div>

      <Card>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Booking Confirmation', type: 'booking', icon: CheckCircle, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
            { label: 'Appointment Reminder', type: 'reminder', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20' },
            { label: 'Birthday Greeting', type: 'birthday', icon: Bell, color: 'text-violet-600', bg: 'bg-violet-50 dark:bg-violet-900/20' },
            { label: 'Payment Receipt', type: 'payment', icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
          ].map(item => (
            <button
              key={item.type}
              onClick={() => sendBulkNotification(item.type)}
              className={`p-4 rounded-xl ${item.bg} border border-transparent hover:border-gray-300 dark:hover:border-gray-600 transition-all text-left`}
            >
              <item.icon size={24} className={`${item.color} mb-2`} />
              <div className="font-semibold text-gray-900 dark:text-white text-sm">{item.label}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Send via WhatsApp</div>
            </button>
          ))}
        </div>

        <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            <option value="all">All Types</option>
            <option value="booking">Booking</option>
            <option value="payment">Payment</option>
            <option value="reminder">Reminder</option>
            <option value="birthday">Birthday</option>
            <option value="system">System</option>
          </select>
          <select
            value={channelFilter}
            onChange={e => setChannelFilter(e.target.value)}
            className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            <option value="all">All Channels</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="sms">SMS</option>
            <option value="email">Email</option>
            <option value="push">Push</option>
          </select>
        </div>

        <div className="space-y-3">
          {notifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 dark:text-gray-400">No notifications found</p>
            </div>
          ) : notifications.map(notification => {
            const ChannelIcon = channelIcons[notification.channel] || Bell
            const channelColor = channelColors[notification.channel] || 'text-gray-600'
            return (
              <div key={notification.id} className="flex items-start gap-4 p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                  <ChannelIcon size={20} className={channelColor} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-900 dark:text-white">{notification.title}</span>
                    <Badge status={notification.status}>{notification.status}</Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{notification.message}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                    <span>To: {notification.recipient}</span>
                    <span>•</span>
                    <span className="capitalize">{notification.channel}</span>
                    <span>•</span>
                    <span>{formatDate(notification.createdAt)}</span>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  {notification.status === 'sent' && <CheckCircle size={20} className="text-emerald-600" />}
                  {notification.status === 'failed' && <XCircle size={20} className="text-red-600" />}
                  {notification.status === 'pending' && <Clock size={20} className="text-amber-600" />}
                </div>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}
