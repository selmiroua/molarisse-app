package com.projet.molarisse.demande;
import org.springframework.web.multipart.MultipartFile;

public class DemandeReq {



        private String nom;
        private String prenom;
        //private MultipartFile photo;  // Champ pour la photo

        // Autres champs
        private String autreChamp;

        // Getters et setters
        public String getNom() {
            return nom;
        }

        public void setNom(String nom) {
            this.nom = nom;
        }

        public String getPrenom() {
            return prenom;
        }

        public void setPrenom(String prenom) {
            this.prenom = prenom;
        }

       // public MultipartFile getPhoto() {
      //      return photo;
        //}

       // public void setPhoto(MultipartFile photo) {
           // this.photo = photo;
       // }

        public String getAutreChamp() {
            return autreChamp;
        }

        public void setAutreChamp(String autreChamp) {
            this.autreChamp = autreChamp;
        }
    }

