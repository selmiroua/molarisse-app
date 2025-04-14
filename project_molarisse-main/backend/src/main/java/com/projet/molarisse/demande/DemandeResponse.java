package com.projet.molarisse.demande;

import com.projet.molarisse.user.User;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class DemandeResponse {
    private Long id;
    private User user;
    private String nom;
    private String prenom;
    private String email;
    private String telephone;
    private String adresse;
    private String ville;
    private String codePostal;
    private int anneeExperience;
    private String specialite;
    private String autreSpecialite;
    private boolean aCabinet;
    private String nomCabinet;
    private String adresseCabinet;
    private String villeCabinet;
    private String codePostalCabinet;
    private String photoPath;
    private String photoCabinetPath;
    private String photoDiplomePath;
    private String status;
    private LocalDateTime createdAt;

    public DemandeResponse(Demande demande) {
        this.id = demande.getId();
        this.user = demande.getUser();
        this.nom = demande.getNom();
        this.prenom = demande.getPrenom();
        this.email = demande.getEmail();
        this.telephone = demande.getTelephone();
        this.adresse = demande.getAdresse();
        this.ville = demande.getVille();
        this.codePostal = demande.getCodePostal();
        this.anneeExperience = demande.getAnneeExperience();
        this.specialite = demande.getSpecialite();
        this.autreSpecialite = demande.getAutreSpecialite();
        this.aCabinet = demande.isACabinet();
        
        // Only set cabinet information if the doctor has a cabinet
        if (demande.isACabinet()) {
            this.nomCabinet = demande.getNomCabinet();
            this.adresseCabinet = demande.getAdresseCabinet();
            this.villeCabinet = demande.getVilleCabinet();
            this.codePostalCabinet = demande.getCodePostalCabinet();
            this.photoCabinetPath = demande.getPhotoCabinetPath();
        } else {
            this.nomCabinet = null;
            this.adresseCabinet = null;
            this.villeCabinet = null;
            this.codePostalCabinet = null;
            this.photoCabinetPath = null;
        }
        
        this.photoPath = demande.getPhotoPath();
        this.photoDiplomePath = demande.getPhotoDiplomePath();
        this.status = demande.getStatus().toString();
        this.createdAt = demande.getCreatedAt();
    }
}