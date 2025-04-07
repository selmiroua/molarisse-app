import { Component, OnInit } from '@angular/core';
import { NotificationService, Notification } from '../../services/notification.service';

@Component({
  selector: 'app-notification-dropdown',
  templateUrl: './notification-dropdown.component.html',
  styleUrls: ['./notification-dropdown.component.scss']
})
export class NotificationDropdownComponent implements OnInit {
  notifications: Notification[] = [];
  unreadCount: number = 0;
  isOpen: boolean = false;

  constructor(private notificationService: NotificationService) {}

  ngOnInit() {
    this.loadNotifications();
    this.loadUnreadCount();
    // Refresh notifications every minute
    setInterval(() => {
      this.loadNotifications();
      this.loadUnreadCount();
    }, 60000);
  }

  loadNotifications() {
    this.notificationService.getNotifications().subscribe(
      (data) => {
        this.notifications = data;
      },
      (error) => {
        console.error('Error loading notifications:', error);
      }
    );
  }

  loadUnreadCount() {
    this.notificationService.getUnreadCount().subscribe(
      (count) => {
        this.unreadCount = count;
      },
      (error) => {
        console.error('Error loading unread count:', error);
      }
    );
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.loadNotifications();
    }
  }

  markAsRead(notification: Notification) {
    this.notificationService.markAsRead(notification.id).subscribe(
      () => {
        notification.isRead = true;
        this.loadUnreadCount();
      },
      (error) => {
        console.error('Error marking notification as read:', error);
      }
    );
  }

  markAllAsRead() {
    this.notificationService.markAllAsRead().subscribe(
      () => {
        this.notifications.forEach(n => n.isRead = true);
        this.unreadCount = 0;
      },
      (error) => {
        console.error('Error marking all notifications as read:', error);
      }
    );
  }
}