package com.projet.molarisse.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UpdateProfileRequest {
    private String oldEmail;  // Added for profile identification
    private String nom;
    private String prenom;
    private String email;
    private LocalDate dateNaissance;
    private String password;
}
