package com.projet.molarisse.appointment;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.projet.molarisse.user.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@EntityListeners(AuditingEntityListener.class)
@Table(name = "appointment")
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "patient_id", nullable = false)
    @JsonManagedReference
    private User patient; // The patient who booked the appointment

    @ManyToOne
    @JoinColumn(name = "doctor_id", nullable = false)
    @JsonManagedReference
    private User doctor; // The doctor for the appointment

    @ManyToOne
    @JoinColumn(name = "secretary_id")
    @JsonManagedReference
    private User secretary; // The secretary managing the appointment

    private LocalDateTime appointmentDateTime; // Date and time of the appointment

    @Enumerated(EnumType.STRING)
    private AppointmentStatus status; // Status of the appointment (e.g., PENDING, ACCEPTED, REJECTED)

    @Enumerated(EnumType.STRING)
    private CaseType caseType; // Type of case (e.g., URGENT, NORMAL, CONTROLE)

    @Enumerated(EnumType.STRING)
    private AppointmentType appointmentType; // Type of appointment (e.g., CONSULTATION, EXTRACTION)

    private String notes; // Additional notes or comments

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime creationDate;

    @LastModifiedDate
    @Column(insertable = false)
    private LocalDateTime modificationDate;

    public enum AppointmentStatus {
        PENDING, // Appointment is waiting for approval
        ACCEPTED, // Appointment is accepted by the secretary
        REJECTED, // Appointment is rejected by the secretary
        COMPLETED // Appointment is completed
    }
}