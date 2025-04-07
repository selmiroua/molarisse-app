package com.projet.molarisse.user;

import com.projet.molarisse.dto.ProfileUpdateRequest;
import com.projet.molarisse.handler.BusinessErrorCodes;
import com.projet.molarisse.service.FileStorageService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.projet.molarisse.role.Role;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.projet.molarisse.role.RoleRepository;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final FileStorageService fileStorageService;
    private final RoleRepository roleRepository;
    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    @Transactional(readOnly = true)
    public User getCurrentUser(Authentication authentication) {
        String email = authentication.getName();
        logger.info("Getting current user for email: {}", email);
        return userRepository.findByEmail(email)
                .orElseThrow(() -> {
                    logger.error("User not found for email: {}", email);
                    return new EntityNotFoundException(BusinessErrorCodes.USER_NOT_FOUND.getDescription());
                });
    }

    @Transactional
    public User updateProfile(Authentication authentication, UpdateProfileRequest request) {
        // First verify if the oldEmail matches the authenticated user
        String authenticatedEmail = authentication.getName();
        if (request.getOldEmail() != null && !request.getOldEmail().equals(authenticatedEmail)) {
            throw new IllegalArgumentException(BusinessErrorCodes.UNAUTHORIZED_PROFILE_MODIFICATION.getDescription());
        }

        User user = userRepository.findByEmail(request.getOldEmail() != null ? request.getOldEmail() : authenticatedEmail)
                .orElseThrow(() -> new EntityNotFoundException(BusinessErrorCodes.USER_NOT_FOUND.getDescription()));
        
        if (request.getNom() != null) {
            user.setNom(request.getNom());
        }
        if (request.getPrenom() != null) {
            user.setPrenom(request.getPrenom());
        }
        if (request.getEmail() != null && !user.getEmail().equals(request.getEmail())) {
            // Check if email is already taken
            if (userRepository.findByEmail(request.getEmail()).isPresent()) {
                throw new IllegalArgumentException(BusinessErrorCodes.EMAIL_ALREADY_EXISTS.getDescription());
            }
            user.setEmail(request.getEmail());
        }
        if (request.getDateNaissance() != null) {
            user.setDateNaissance(request.getDateNaissance());
        }
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        return userRepository.save(user);
    }

    @Transactional
    public User updateProfile(Authentication authentication, ProfileUpdateRequest profileUpdateRequest) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        
        // Update user fields only if they are provided
        if (profileUpdateRequest.getNom() != null && !profileUpdateRequest.getNom().isEmpty()) {
            user.setNom(profileUpdateRequest.getNom());
        }
        
        if (profileUpdateRequest.getPrenom() != null && !profileUpdateRequest.getPrenom().isEmpty()) {
            user.setPrenom(profileUpdateRequest.getPrenom());
        }
        
        if (profileUpdateRequest.getEmail() != null && !profileUpdateRequest.getEmail().isEmpty()) {
            // Check if email is already taken by another user
            if (!user.getEmail().equals(profileUpdateRequest.getEmail()) && 
                userRepository.findByEmail(profileUpdateRequest.getEmail()).isPresent()) {
                throw new IllegalArgumentException("Email already exists");
            }
            user.setEmail(profileUpdateRequest.getEmail());
        }
        
        if (profileUpdateRequest.getAddress() != null && !profileUpdateRequest.getAddress().isEmpty()) {
            user.setAddress(profileUpdateRequest.getAddress());
        }
        
        if (profileUpdateRequest.getPhoneNumber() != null && !profileUpdateRequest.getPhoneNumber().isEmpty()) {
            user.setPhoneNumber(profileUpdateRequest.getPhoneNumber());
        }
        
        if (profileUpdateRequest.getDateNaissance() != null) {
            user.setDateNaissance(profileUpdateRequest.getDateNaissance());
        }

        return userRepository.save(user);
    }

    @Transactional
    public User updateProfilePicture(Authentication authentication, MultipartFile file) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // Delete old profile picture if it exists
        if (user.getProfilePicturePath() != null) {
            fileStorageService.deleteFile(user.getProfilePicturePath());
        }

        // Store new profile picture
        String fileName = fileStorageService.storeFile(file);
        user.setProfilePicturePath(fileName);

        return userRepository.save(user);
    }

    @Transactional
    public void changePassword(Authentication authentication, ChangePasswordRequest request) {
        User user = getCurrentUser(authentication);
        
        // Verify current password
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Current password is incorrect");
        }
        
        // Update password
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    @Transactional
    public User getAdminUser() {
        Role adminRole = roleRepository.findByNom(Role.ADMIN)
                .orElseThrow(() -> new RuntimeException("Admin role not found"));
        return userRepository.findFirstByRole(adminRole)
                .orElseThrow(() -> new RuntimeException("Admin user not found"));
    }
}
