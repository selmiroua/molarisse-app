import { Component, OnInit } from '@angular/core';
import { NotificationService } from './notification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
  notifications = [];

  constructor(private notificationService: NotificationService, private router: Router) {}

  ngOnInit() {
    this.notificationService.getNotifications().subscribe(data => {
      this.notifications = data;
    });
  }

  viewDemande(notification) {
    this.notificationService.markAsRead(notification.id).subscribe(() => {
      this.router.navigate(['/admin/demandes']);
    });
  }
}
