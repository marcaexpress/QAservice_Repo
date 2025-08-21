'use client';

import { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface CMSNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface CMSNotificationsProps {
  notifications: CMSNotification[];
  onRemove: (id: string) => void;
}

const NOTIFICATION_ICONS = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info
};

const NOTIFICATION_COLORS = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800'
};

const NOTIFICATION_ICON_COLORS = {
  success: 'text-green-400',
  error: 'text-red-400',
  warning: 'text-yellow-400',
  info: 'text-blue-400'
};

export function CMSNotifications({ notifications, onRemove }: CMSNotificationsProps) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-3">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
}

interface NotificationItemProps {
  notification: CMSNotification;
  onRemove: (id: string) => void;
}

function NotificationItem({ notification, onRemove }: NotificationItemProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isRemoving, setIsRemoving] = useState(false);

  useEffect(() => {
    if (notification.duration) {
      const timer = setTimeout(() => {
        handleRemove();
      }, notification.duration);

      return () => clearTimeout(timer);
    }
  }, [notification.duration]);

  const handleRemove = () => {
    setIsRemoving(true);
    setTimeout(() => {
      onRemove(notification.id);
    }, 300);
  };

  const Icon = NOTIFICATION_ICONS[notification.type];

  return (
    <div
      className={`
        ${NOTIFICATION_COLORS[notification.type]}
        border rounded-lg p-4 shadow-lg max-w-sm transition-all duration-300 transform
        ${isVisible && !isRemoving ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      `}
    >
      <div className="flex items-start space-x-3">
        <Icon className={`w-5 h-5 mt-0.5 ${NOTIFICATION_ICON_COLORS[notification.type]}`} />
        
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium">{notification.title}</h4>
          <p className="text-sm mt-1">{notification.message}</p>
          
          {notification.action && (
            <button
              onClick={notification.action.onClick}
              className="mt-2 text-sm font-medium underline hover:no-underline"
            >
              {notification.action.label}
            </button>
          )}
        </div>
        
        <button
          onClick={handleRemove}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ===== NOTIFICATION HOOK =====

export function useCMSNotifications() {
  const [notifications, setNotifications] = useState<CMSNotification[]>([]);

  const addNotification = (notification: Omit<CMSNotification, 'id'>) => {
    const id = `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newNotification = { ...notification, id };
    
    setNotifications(prev => [...prev, newNotification]);
    
    return id;
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const showSuccess = (title: string, message: string, options?: Partial<CMSNotification>) => {
    return addNotification({
      type: 'success',
      title,
      message,
      duration: 5000,
      ...options
    });
  };

  const showError = (title: string, message: string, options?: Partial<CMSNotification>) => {
    return addNotification({
      type: 'error',
      title,
      message,
      duration: 8000,
      ...options
    });
  };

  const showWarning = (title: string, message: string, options?: Partial<CMSNotification>) => {
    return addNotification({
      type: 'warning',
      title,
      message,
      duration: 6000,
      ...options
    });
  };

  const showInfo = (title: string, message: string, options?: Partial<CMSNotification>) => {
    return addNotification({
      type: 'info',
      title,
      message,
      duration: 4000,
      ...options
    });
  };

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
    showSuccess,
    showError,
    showWarning,
    showInfo
  };
}

// ===== NOTIFICATION CONTEXT =====

import { createContext, useContext, ReactNode } from 'react';

interface CMSNotificationContextType {
  showSuccess: (title: string, message: string, options?: Partial<CMSNotification>) => string;
  showError: (title: string, message: string, options?: Partial<CMSNotification>) => string;
  showWarning: (title: string, message: string, options?: Partial<CMSNotification>) => string;
  showInfo: (title: string, message: string, options?: Partial<CMSNotification>) => string;
}

const CMSNotificationContext = createContext<CMSNotificationContextType | undefined>(undefined);

export function useCMSNotificationContext() {
  const context = useContext(CMSNotificationContext);
  if (!context) {
    throw new Error('useCMSNotificationContext must be used within a CMSNotificationProvider');
  }
  return context;
}

interface CMSNotificationProviderProps {
  children: ReactNode;
}

export function CMSNotificationProvider({ children }: CMSNotificationProviderProps) {
  const notificationUtils = useCMSNotifications();

  return (
    <CMSNotificationContext.Provider value={notificationUtils}>
      {children}
      <CMSNotifications
        notifications={notificationUtils.notifications}
        onRemove={notificationUtils.removeNotification}
      />
    </CMSNotificationContext.Provider>
  );
}
