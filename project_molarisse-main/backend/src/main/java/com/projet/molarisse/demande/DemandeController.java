package com.projet.molarisse.demande;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import com.projet.molarisse.service.FileStorageService;
import java.util.List;
import org.springframework.security.core.context.SecurityContextHolder;
import com.projet.molarisse.user.User;
import com.projet.molarisse.user.UserService;

@RestController
@RequestMapping("/demandes")
@CrossOrigin(origins = "http://localhost:4200", maxAge = 3600, allowCredentials = "true")
@RequiredArgsConstructor
public class DemandeController {
    private final DemandeService demandeService;
    private final FileStorageService fileStorageService;
    private final UserService userService;

    @GetMapping("/pictures/{fileName:.+}")
    public ResponseEntity<Resource> getPicture(@PathVariable String fileName) {
        try {
            Resource resource = fileStorageService.loadFileAsResource(fileName);
            String contentType = determineContentType(fileName);
            
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    private String determineContentType(String fileName) {
        fileName = fileName.toLowerCase();
        if (fileName.endsWith(".jpg") || fileName.endsWith(".jpeg")) {
            return "image/jpeg";
        } else if (fileName.endsWith(".png")) {
            return "image/png";
        } else if (fileName.endsWith(".gif")) {
            return "image/gif";
        }
        return "application/octet-stream";
    }

    @PostMapping(value = "", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<DemandeResponse> submitDemande(
            @RequestPart("nom") String nom,
            @RequestPart("prenom") String prenom,
            @RequestPart("email") String email,
            @RequestPart("telephone") String telephone,
            @RequestPart("adresse") String adresse,
            @RequestPart("ville") String ville,
            @RequestPart("codePostal") String codePostal,
            @RequestPart("anneeExperience") String anneeExperience,
            @RequestPart("specialite") String specialite,
            @RequestPart(value = "autreSpecialite", required = false) String autreSpecialite,
            @RequestPart("aCabinet") String aCabinet,
            @RequestPart(value = "nomCabinet", required = false) String nomCabinet,
            @RequestPart(value = "adresseCabinet", required = false) String adresseCabinet,
            @RequestPart(value = "villeCabinet", required = false) String villeCabinet,
            @RequestPart(value = "codePostalCabinet", required = false) String codePostalCabinet,
            @RequestPart("photo") MultipartFile photo,
            @RequestPart(value = "cabinetPhoto", required = false) MultipartFile cabinetPhoto,
            @RequestPart("diplomePhoto") MultipartFile diplomePhoto) {

        DemandeRequest request = new DemandeRequest();
        request.setNom(nom);
        request.setPrenom(prenom);
        request.setEmail(email);
        request.setTelephone(telephone);
        request.setAdresse(adresse);
        request.setVille(ville);
        request.setCodePostal(codePostal);
        request.setAnneeExperience(Integer.parseInt(anneeExperience));
        request.setSpecialite(specialite);
        request.setAutreSpecialite(autreSpecialite);
        request.setACabinet(Boolean.parseBoolean(aCabinet));
        request.setNomCabinet(nomCabinet);
        request.setAdresseCabinet(adresseCabinet);
        request.setVilleCabinet(villeCabinet);
        request.setCodePostalCabinet(codePostalCabinet);
        request.setPhoto(photo);
        request.setCabinetPhoto(cabinetPhoto);
        request.setDiplomePhoto(diplomePhoto);

        DemandeResponse response = demandeService.submitDemande(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/check")
    public ResponseEntity<Boolean> checkPendingDemande() {
        boolean hasPending = demandeService.hasPendingDemande();
        return ResponseEntity.ok(hasPending);
    }

    @GetMapping("/all")
    @Secured("ROLE_admin")
    public ResponseEntity<List<DemandeResponse>> getAllDemandes() {
        List<DemandeResponse> demandes = demandeService.getAllDemandes();
        return ResponseEntity.ok(demandes);
    }

    @PutMapping("/{id}/status")
    @Secured("ROLE_admin")
    public ResponseEntity<DemandeResponse> updateDemandeStatus(
            @PathVariable Long id,
            @RequestParam Demande.Status status) {
        DemandeResponse updatedDemande = demandeService.updateDemandeStatus(id, status);
        return ResponseEntity.ok(updatedDemande);
    }

    @GetMapping("/current")
    public ResponseEntity<DemandeResponse> getCurrentUserDemande() {
        return demandeService.findByCurrentUser()
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/accepted")
    public ResponseEntity<List<DemandeResponse>> getAcceptedDoctors() {
        List<DemandeResponse> acceptedDoctors = demandeService.findAllAcceptedDoctors();
        return ResponseEntity.ok(acceptedDoctors);
    }
}