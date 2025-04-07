package com.projet.molarisse.demande;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.beans.factory.annotation.Value;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

    @RestController
    @RequestMapping("/demandes")
    @CrossOrigin(origins = "http://localhost:4200", maxAge = 3600, allowCredentials = "true")
    public class DemandeReqController {

        @Value("${upload.path}") // Chemin pour stocker les fichiers
        private String uploadDir;

        @PostMapping("/roua")
        public ResponseEntity<String> submitDemande(
                @RequestParam("nom") String nom,
                @RequestParam("prenom") String prenom,
                //@RequestParam("photo") MultipartFile photo,  // Photo en multipart
                @RequestParam("autreChamp") String autreChamp
        ) throws IOException {
            // Sauvegarde de la photo
            //if (!photo.isEmpty()) {
            //  String photoFilename = photo.getOriginalFilename();
            //Path photoPath = Paths.get(uploadDir, photoFilename);
            //Files.copy(photo.getInputStream(), photoPath);
            //}

            // Traitement de la demande et enregistrement des autres informations
            // Exemple : log les informations reçues
            System.out.println("Nom: " + nom);
            System.out.println("Prénom: " + prenom);
            System.out.println("Autre Champ: " + autreChamp);

            // Retourner une réponse succès
            return new ResponseEntity<>("Demande soumise avec succès", HttpStatus.OK);

        }
    }

