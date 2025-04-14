package com.projet.molarisse.demande;

import com.projet.molarisse.user.User;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Entity
@Data
public class Demande {
    private static final Logger logger = LoggerFactory.getLogger(Demande.class);

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

    public String getSpecialite() {
        logger.info("Accessing specialite: {}", specialite);
        return specialite;
    }

    public int getAnneeExperience() {
        logger.info("Accessing anneeExperience: {}", anneeExperience);
        return anneeExperience;
    }

    public String getAdresseCabinet() {
        logger.info("Accessing adresseCabinet: {}", adresseCabinet);
        return adresseCabinet;
    }

    public String getVilleCabinet() {
        logger.info("Accessing villeCabinet: {}", villeCabinet);
        return villeCabinet;
    }

    public String getCodePostalCabinet() {
        logger.info("Accessing codePostalCabinet: {}", codePostalCabinet);
        return codePostalCabinet;
    }

    public boolean isACabinet() {
        logger.info("Accessing aCabinet: {}", aCabinet);
        return aCabinet;
    }

    public void setSpecialite(String specialite) {
        logger.info("Setting specialite to: {}", specialite);
        this.specialite = specialite;
    }

    public void setAutreSpecialite(String autreSpecialite) {
        logger.info("Setting autreSpecialite to: {}", autreSpecialite);
        this.autreSpecialite = autreSpecialite;
    }

    public void setAnneeExperience(int anneeExperience) {
        logger.info("Setting anneeExperience to: {}", anneeExperience);
        this.anneeExperience = anneeExperience;
    }

    public void setAdresseCabinet(String adresseCabinet) {
        logger.info("Setting adresseCabinet to: {}", adresseCabinet);
        this.adresseCabinet = adresseCabinet;
    }

    public void setVilleCabinet(String villeCabinet) {
        logger.info("Setting villeCabinet to: {}", villeCabinet);
        this.villeCabinet = villeCabinet;
    }

    public void setCodePostalCabinet(String codePostalCabinet) {
        logger.info("Setting codePostalCabinet to: {}", codePostalCabinet);
        this.codePostalCabinet = codePostalCabinet;
    }

    public void setACabinet(boolean aCabinet) {
        logger.info("Setting aCabinet to: {}", aCabinet);
}}