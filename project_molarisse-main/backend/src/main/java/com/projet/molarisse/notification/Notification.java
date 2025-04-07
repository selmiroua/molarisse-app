package com.projet.molarisse.notification;

import com.projet.molarisse.user.User;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String message;
    
    @Column(name = "is_read")
    private boolean read = false;

    @ManyToOne
    private User recipient;

    private LocalDateTime createdAt = LocalDateTime.now();
} 