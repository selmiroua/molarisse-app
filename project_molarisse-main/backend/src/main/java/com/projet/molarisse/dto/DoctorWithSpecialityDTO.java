package com.projet.molarisse.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DoctorWithSpecialityDTO {
    private Integer id;
    private String nom;
    private String prenom;
    private String email;
    private String phoneNumber;
    private String specialite;
    private String autreSpecialite;
    private int anneeExperience;
    private String adresseCabinet;
    private String villeCabinet;
    private String codePostalCabinet;
    private boolean aCabinet;
    private String photoPath;
} 