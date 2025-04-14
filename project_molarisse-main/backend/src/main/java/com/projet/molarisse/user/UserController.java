package com.projet.molarisse.user;

import com.projet.molarisse.dto.ProfileUpdateRequest;
import com.projet.molarisse.service.FileStorageService;
import com.projet.molarisse.config.FileStorageConfig;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.projet.molarisse.dto.DoctorWithSpecialityDTO;
import com.projet.molarisse.demande.DemandeService;
import com.projet.molarisse.demande.DemandeResponse;

import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.Files;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    private final FileStorageService fileStorageService;
    private final DemandeService demandeService;
    private final FileStorageConfig fileStorageConfig;

    @GetMapping("/profile")
    public ResponseEntity<User> getCurrentUserProfile(Authentication authentication) {
        System.out.println("Getting current user profile for: " + authentication.getName());
        return ResponseEntity.ok(userService.getCurrentUser(authentication));
    }

    @PutMapping("/profile")
    public ResponseEntity<User> updateProfile(
            Authentication authentication,
            @Valid @RequestBody ProfileUpdateRequest profileUpdateRequest
    ) {
        return ResponseEntity.ok(userService.updateProfile(authentication, profileUpdateRequest));
    }

    @PostMapping("/profile/picture")
    public ResponseEntity<User> uploadProfilePicture(
            Authentication authentication,
            @RequestParam("file") MultipartFile file
    ) {
        // Validate file
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        // Validate file type
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            return ResponseEntity.badRequest().build();
        }

        // Validate file size (5MB max)
        if (file.getSize() > 5 * 1024 * 1024) {
            return ResponseEntity.badRequest().build();
        }

        User updatedUser = userService.updateProfilePicture(authentication, file);
        return ResponseEntity.ok(updatedUser);
    }

    @GetMapping("/profile/picture/{fileName:.+}")
    public ResponseEntity<Resource> getProfilePicture(@PathVariable String fileName) {
        System.out.println("Profile picture requested: " + fileName);
        try {
            Path filePath = Paths.get(fileStorageConfig.getUploadDir()).resolve(fileName).normalize();
            System.out.println("Looking for file at absolute path: " + filePath.toAbsolutePath());
            System.out.println("File exists: " + Files.exists(filePath));
            
            Resource resource = fileStorageService.loadFileAsResource(fileName);
            String contentType = "image/jpeg";
            if (fileName.toLowerCase().endsWith(".png")) {
                contentType = "image/png";
            } else if (fileName.toLowerCase().endsWith(".gif")) {
                contentType = "image/gif";
            }
            System.out.println("Serving file with content type: " + contentType);
            
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);
        } catch (Exception e) {
            System.err.println("Error loading profile picture: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.notFound().build();
        }
    }
    
    @RequestMapping(value = "/profile/picture/**", method = RequestMethod.OPTIONS)
    public ResponseEntity<?> handleProfilePictureOptions() {
        return ResponseEntity.ok().build();
    }

    @PutMapping("/password")
    public ResponseEntity<?> changePassword(
            Authentication authentication,
            @RequestBody ChangePasswordRequest request
    ) {
        userService.changePassword(authentication, request);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/test")
    public ResponseEntity<Map<String, String>> testEndpoint() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Backend is working correctly");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/doctors")
    public ResponseEntity<List<User>> getAllDoctors() {
        System.out.println("Fetching all doctors");
        List<User> doctors = userService.getAllDoctors();
        System.out.println("Found " + doctors.size() + " doctors");
        return ResponseEntity.ok(doctors);
    }

    @GetMapping("/doctors/accepted")
    public ResponseEntity<List<DoctorWithSpecialityDTO>> getAcceptedDoctors() {
        System.out.println("=== getAcceptedDoctors endpoint called ===");
        List<DemandeResponse> acceptedDemandes = demandeService.findAllAcceptedDoctors();
        
        List<DoctorWithSpecialityDTO> doctorDTOs = acceptedDemandes.stream()
            .map(demande -> {
                User doctor = demande.getUser();
                String photoPath = doctor.getProfilePicturePath();
               
                System.out.println("Processing doctor: " + doctor.getEmail() + " with profile picture path: " + photoPath);
                return DoctorWithSpecialityDTO.builder()
                    .id(doctor.getId())
                    .nom(demande.getNom())
                    .prenom(demande.getPrenom())
                    .email(demande.getEmail())
                    .phoneNumber(demande.getTelephone())
                    .specialite(demande.getSpecialite())
                    .autreSpecialite(demande.getAutreSpecialite())
                    .anneeExperience(demande.getAnneeExperience())
                    .adresseCabinet(demande.getAdresseCabinet())
                    .villeCabinet(demande.getVilleCabinet())
                    .codePostalCabinet(demande.getCodePostalCabinet())
                    .aCabinet(demande.isACabinet())
                    .photoPath(photoPath)
                    .build();
            })
            .collect(Collectors.toList());
        
        System.out.println("Found " + doctorDTOs.size() + " accepted doctors");
        return ResponseEntity.ok(doctorDTOs);
    }
    
    @RequestMapping(value = "/doctors/accepted", method = RequestMethod.OPTIONS)
    public ResponseEntity<?> handleDoctorsAcceptedOptions() {
        return ResponseEntity.ok().build();
    }
}
