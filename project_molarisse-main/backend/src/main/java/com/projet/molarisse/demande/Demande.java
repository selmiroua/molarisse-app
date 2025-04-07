package com.projet.molarisse.demande;

import com.projet.molarisse.user.User;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
public class Demande {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private User user;

    // Personal Information
    private String nom;
    private String prenom;
    private String email;
    private String telephone;
    private String adresse;
    private String ville;
    private String codePostal;

    // Professional Information
    private int anneeExperience;
    private String specialite;
    private String autreSpecialite;
    private boolean aCabinet;

    // Cabinet Information
    private String nomCabinet;
    private String adresseCabinet;
    private String villeCabinet;
    private String codePostalCabinet;

    // File paths
    private String photoPath;
    private String photoCabinetPath;
    private String photoDiplomePath;

    // Status
    @Enumerated(EnumType.STRING)
    private Status status = Status.PENDING;

    private LocalDateTime createdAt = LocalDateTime.now();

    public enum Status {
        PENDING, APPROVED, REJECTED
    }
}