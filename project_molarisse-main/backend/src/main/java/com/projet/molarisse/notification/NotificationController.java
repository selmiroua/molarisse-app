package com.projet.molarisse.notification;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.projet.molarisse.user.User;
import com.projet.molarisse.user.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;

@RestController
@RequestMapping("/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {
    private static final Logger logger = LoggerFactory.getLogger(NotificationController.class);

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private UserService userService;

    @GetMapping("/user")
    public ResponseEntity<List<Notification>> getUserNotifications(Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            logger.info("Getting notifications for user: {}", userEmail);
            
            // Get authentication from security context if not provided
            if (authentication == null) {
                authentication = SecurityContextHolder.getContext().getAuthentication();
                if (authentication == null) {
                    logger.error("No authentication found in security context");
                    return ResponseEntity.badRequest().build();
                }
            }

            User user = userService.getCurrentUser(authentication);
            if (user == null) {
                logger.error("User not found for email: {}", userEmail);
                return ResponseEntity.badRequest().build();
            }

            logger.info("Found user: {} with ID: {}", user.getEmail(), user.getId());
            List<Notification> notifications = notificationService.getNotificationsForUser(user);
            logger.info("Found {} notifications for user", notifications.size());
            return ResponseEntity.ok(notifications);
        } catch (EntityNotFoundException e) {
            logger.error("User not found: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            logger.error("Error getting notifications: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable Long id, Authentication authentication) {
        try {
            logger.info("Marking notification {} as read", id);
            notificationService.markAsRead(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            logger.error("Error marking notification as read: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/mark-all-read")
    public ResponseEntity<Void> markAllAsRead(Authentication authentication) {
        try {
            User user = userService.getCurrentUser(authentication);
            logger.info("Marking all notifications as read for user: {}", user.getEmail());
            notificationService.markAllAsRead(user);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            logger.error("Error marking all notifications as read: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
} 