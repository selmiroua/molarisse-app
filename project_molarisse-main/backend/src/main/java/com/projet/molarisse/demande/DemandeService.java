package com.projet.molarisse.demande;

import com.projet.molarisse.service.FileStorageService;
import com.projet.molarisse.user.User;
import com.projet.molarisse.user.UserService;
//import com.projet.molarisse.notification.Notification;
//import com.projet.molarisse.notification.NotificationRepository;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
@RequiredArgsConstructor
public class DemandeService {
    private final DemandeRepository demandeRepository;
    private final FileStorageService fileStorageService;
    private final UserService userService;
    //private final NotificationRepository notificationRepository;
    private static final Logger logger = LoggerFactory.getLogger(DemandeService.class);

    @Transactional
    public DemandeResponse submitDemande(DemandeRequest request) {
        User currentUser = userService.getCurrentUser(
                SecurityContextHolder.getContext().getAuthentication()
        );

        String photoPath = fileStorageService.storeFile(request.getPhoto());
        String diplomePhotoPath = fileStorageService.storeFile(request.getDiplomePhoto());

        String cabinetPhotoPath = null;
        if (request.isACabinet() && request.getCabinetPhoto() != null) {
            cabinetPhotoPath = fileStorageService.storeFile(request.getCabinetPhoto());
        }

        Demande demande = new Demande();
        demande.setUser(currentUser);
        demande.setNom(request.getNom());
        demande.setPrenom(request.getPrenom());
        demande.setEmail(request.getEmail());
        demande.setTelephone(request.getTelephone());
        demande.setAdresse(request.getAdresse());
        demande.setVille(request.getVille());
        demande.setCodePostal(request.getCodePostal());
        demande.setAnneeExperience(request.getAnneeExperience());
        demande.setSpecialite(request.getSpecialite());
        demande.setAutreSpecialite(request.getAutreSpecialite());
        demande.setACabinet(request.isACabinet());

        if (request.isACabinet()) {
            demande.setNomCabinet(request.getNomCabinet());
            demande.setAdresseCabinet(request.getAdresseCabinet());
            demande.setVilleCabinet(request.getVilleCabinet());
            demande.setCodePostalCabinet(request.getCodePostalCabinet());
            demande.setPhotoCabinetPath(cabinetPhotoPath);
        }

        demande.setPhotoPath(photoPath);
        demande.setPhotoDiplomePath(diplomePhotoPath);

        Demande savedDemande = demandeRepository.save(demande);

        // Create a notification for the admin
       // Notification notification = new Notification();
        //notification.setMessage("New demande submitted by " + currentUser.getNom());
        //notification.setRecipient(userService.getAdminUser()); // Assume getAdminUser fetches the admin
        //notificationRepository.save(notification);

        return new DemandeResponse(savedDemande);
    }

    public boolean hasPendingDemande() {
        User currentUser = userService.getCurrentUser(
                SecurityContextHolder.getContext().getAuthentication()
        );
        return demandeRepository.existsByUserAndStatus(currentUser, Demande.Status.PENDING);
    }

    @Transactional
    public DemandeResponse updateDemandeStatus(Long demandeId, Demande.Status newStatus) {
        Demande demande = demandeRepository.findById(demandeId)
                .orElseThrow(() -> new RuntimeException("Demande not found"));

        demande.setStatus(newStatus);
        Demande updatedDemande = demandeRepository.save(demande);

        // Create notification for the user
        //Notification notification = new Notification();
        // notification.setMessage("Your demande has been " + newStatus.toString().toLowerCase());
        //notification.setRecipient(demande.getUser());
        //notificationRepository.save(notification);

        return new DemandeResponse(updatedDemande);
    }

    public List<DemandeResponse> getAllDemandes() {
        return demandeRepository.findAll().stream()
                .map(DemandeResponse::new)
                .collect(Collectors.toList());
    }

    public Optional<DemandeResponse> findByCurrentUser() {
        User currentUser = userService.getCurrentUser(
                SecurityContextHolder.getContext().getAuthentication()
        );
        return demandeRepository.findLatestByUser(currentUser)
                .map(DemandeResponse::new);
    }

    @Transactional(readOnly = true)
    public List<DemandeResponse> findAllAcceptedDoctors() {
        logger.info("Fetching all accepted doctors");
        List<Demande> acceptedDemandes = demandeRepository.findByStatus(Demande.Status.APPROVED);
        logger.info("Found {} accepted demandes", acceptedDemandes.size());
        
        List<DemandeResponse> responses = acceptedDemandes.stream()
                .map(demande -> {
                    logger.info("Processing demande for doctor: {} {} (Status: {})", 
                              demande.getNom(), 
                              demande.getPrenom(), 
                              demande.getStatus());
                    logger.info("User ID: {}", demande.getUser().getId());
                    logger.info("Specialite: {}", demande.getSpecialite());
                    logger.info("Annee Experience: {}", demande.getAnneeExperience());
                    
                    if (demande.isACabinet()) {
                        logger.info("Doctor has cabinet - Details: {} - {}, {}", 
                                  demande.getNomCabinet(),
                                  demande.getAdresseCabinet(), 
                                  demande.getVilleCabinet(), 
                                  demande.getCodePostalCabinet());
                    } else {
                        logger.info("Doctor does not have a cabinet");
                        // Set cabinet fields to null if doctor doesn't have a cabinet
                        demande.setNomCabinet(null);
                        demande.setAdresseCabinet(null);
                        demande.setVilleCabinet(null);
                        demande.setCodePostalCabinet(null);
                    }
                    
                    return new DemandeResponse(demande);
                })
                .collect(Collectors.toList());
        
        logger.info("Returning {} doctor responses", responses.size());
        return responses;
    }
}