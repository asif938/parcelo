export type NotificationType = "SHIPMENT_UPDATE" | "ASSIGNMENT" | "PAYMENT" | "SYSTEM";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationListResult {
  notifications: Notification[];
  unreadCount: number;
}
