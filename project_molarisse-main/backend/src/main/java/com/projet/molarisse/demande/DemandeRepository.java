package com.projet.molarisse.demande;

import com.projet.molarisse.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface DemandeRepository extends JpaRepository<Demande, Long> {
    @Query("SELECT d FROM Demande d WHERE d.user = :user ORDER BY d.createdAt DESC")
    List<Demande> findByUserOrderByCreatedAtDesc(@Param("user") User user);

    default Optional<Demande> findLatestByUser(User user) {
        return findByUserOrderByCreatedAtDesc(user).stream().findFirst();
    }
    
    boolean existsByUserAndStatus(User user, Demande.Status status);

    List<Demande> findByStatus(Demande.Status status);
    
    @Query("SELECT new map(d.specialite as specialite, " +
           "d.autreSpecialite as autreSpecialite, " +
           "d.anneeExperience as anneeExperience, " +
           "d.adresseCabinet as adresseCabinet, " +
           "d.villeCabinet as villeCabinet, " +
           "d.codePostalCabinet as codePostalCabinet, " +
           "d.aCabinet as aCabinet) " +
           "FROM Demande d " +
           "WHERE d.user = :user AND d.status = :status " +
           "ORDER BY d.createdAt DESC")
    List<java.util.Map<String, Object>> findDoctorDetailsWithStatus(@Param("user") User user, @Param("status") Demande.Status status);

    default Optional<Demande> findByUserAndStatus(User user, Demande.Status status) {
        List<java.util.Map<String, Object>> details = findDoctorDetailsWithStatus(user, status);
        if (!details.isEmpty()) {
            java.util.Map<String, Object> detail = details.get(0);
            Demande demande = new Demande();
            demande.setSpecialite((String) detail.get("specialite"));
            demande.setAutreSpecialite((String) detail.get("autreSpecialite"));
            demande.setAnneeExperience((Integer) detail.get("anneeExperience"));
            demande.setAdresseCabinet((String) detail.get("adresseCabinet"));
            demande.setVilleCabinet((String) detail.get("villeCabinet"));
            demande.setCodePostalCabinet((String) detail.get("codePostalCabinet"));
            demande.setACabinet((Boolean) detail.get("aCabinet"));
            return Optional.of(demande);
        }
        return Optional.empty();
    }
}
