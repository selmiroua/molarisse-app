package com.projet.molarisse.notifications;

import com.projet.molarisse.user.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {
    
    @Autowired
    private NotificationService notificationService;
    
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'USER', 'DOCTOR')")
    public ResponseEntity<List<NotificationDTO>> getAllNotifications() {
        User currentUser = getCurrentUser();
        List<Notification> notifications = notificationService.getNotificationsForUser(currentUser.getId());
        List<NotificationDTO> notificationDTOs = notifications.stream()
            .map(NotificationDTO::fromEntity)
            .collect(Collectors.toList());
        return ResponseEntity.ok(notificationDTOs);
    }
    
    @GetMapping("/unread")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER', 'DOCTOR')")
    public ResponseEntity<List<NotificationDTO>> getUnreadNotifications() {
        User currentUser = getCurrentUser();
        List<Notification> unreadNotifications = notificationService.getUnreadNotificationsForUser(currentUser.getId());
        List<NotificationDTO> notificationDTOs = unreadNotifications.stream()
            .map(NotificationDTO::fromEntity)
            .collect(Collectors.toList());
        return ResponseEntity.ok(notificationDTOs);
    }
    
    @GetMapping("/count")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER', 'DOCTOR')")
    public ResponseEntity<Long> getUnreadCount() {
        User currentUser = getCurrentUser();
        long count = notificationService.getUnreadCount(currentUser.getId());
        return ResponseEntity.ok(count);
    }
    
    @PutMapping("/{notificationId}/read")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER', 'DOCTOR')")
    public ResponseEntity<Void> markAsRead(@PathVariable Integer notificationId) {
        User currentUser = getCurrentUser();
        notificationService.markAsRead(notificationId, currentUser.getId());
        return ResponseEntity.ok().build();
    }
    
    @PutMapping("/read-all")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER', 'DOCTOR')")
    public ResponseEntity<Void> markAllAsRead() {
        User currentUser = getCurrentUser();
        notificationService.markAllAsRead(currentUser.getId());
        return ResponseEntity.ok().build();
    }
    
    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return (User) authentication.getPrincipal();
    }
} 