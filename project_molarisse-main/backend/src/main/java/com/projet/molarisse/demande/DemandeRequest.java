package com.projet.molarisse.demande;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class DemandeRequest {
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

    // Files
    private MultipartFile photo;
    private MultipartFile cabinetPhoto;
    private MultipartFile diplomePhoto;


}