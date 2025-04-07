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
}
