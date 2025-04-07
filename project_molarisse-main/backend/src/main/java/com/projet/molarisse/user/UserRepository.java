package com.projet.molarisse.user;

import org.springframework.data.jpa.repository.JpaRepository;
import com.projet.molarisse.role.Role;
import java.util.Optional;
import java.util.List;

public interface UserRepository extends JpaRepository<User, Integer> {

    Optional<User> findByEmail(String email);
    Optional<User> findFirstByRole(Role role);
    List<User> findByRole(Role role);
}

