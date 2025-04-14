package com.projet.molarisse.appointment;

import com.projet.molarisse.notifications.Notification;
import com.projet.molarisse.notifications.NotificationService;
import com.projet.molarisse.user.User;
import com.projet.molarisse.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public Appointment bookAppointment(
        Integer patientId,
        Integer doctorId,
        LocalDateTime appointmentDateTime,
        CaseType caseType,
        AppointmentType appointmentType,
        String notes) {
        User patient = userRepository.findById(patientId).orElseThrow(() -> new RuntimeException("Patient not found"));
        User doctor = userRepository.findById(doctorId).orElseThrow(() -> new RuntimeException("Doctor not found"));

        Appointment appointment = Appointment.builder()
                .patient(patient)
                .doctor(doctor)
                .appointmentDateTime(appointmentDateTime)
                .caseType(caseType)
                .appointmentType(appointmentType)
                .status(Appointment.AppointmentStatus.PENDING)
                .notes(notes)
                .build();

        Appointment savedAppointment = appointmentRepository.save(appointment);
        
        // Create notification for the doctor
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
        String formattedDateTime = appointmentDateTime.format(formatter);
        String message = "New appointment with patient " + patient.getNom() + " on " + formattedDateTime;
        
        String link = "/doctor/appointments/" + savedAppointment.getId();
        notificationService.createNotification(doctor, message, Notification.NotificationType.NEW_APPOINTMENT, link);
        
        return savedAppointment;
    }

    public List<Appointment> getAppointmentsForPatient(Integer patientId) {
        return appointmentRepository.findByPatientId(patientId);
    }

    public List<Appointment> getAppointmentsForDoctor(Integer doctorId) {
        return appointmentRepository.findByDoctorId(doctorId);
    }

    public List<Appointment> getAppointmentsForSecretary(Integer secretaryId) {
        return appointmentRepository.findBySecretaryId(secretaryId);
    }

    public Appointment updateAppointmentStatus(Integer appointmentId, Appointment.AppointmentStatus status, Integer secretaryId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
        
        User secretary = userRepository.findById(secretaryId)
                .orElseThrow(() -> new RuntimeException("Secretary not found"));
        
        appointment.setStatus(status);
        appointment.setSecretary(secretary);
        
        Appointment updatedAppointment = appointmentRepository.save(appointment);
        
        // Create notification for the doctor if status is changed
        if (updatedAppointment.getDoctor() != null) {
            String message = "Appointment status updated to " + status + " by secretary";
            String link = "/doctor/appointments/" + updatedAppointment.getId();
            notificationService.createNotification(
                updatedAppointment.getDoctor(), 
                message, 
                Notification.NotificationType.APPOINTMENT_UPDATED,
                link
            );
        }
        
        return updatedAppointment;
    }
    
    public Appointment updateAppointmentStatusByDoctor(Integer appointmentId, Appointment.AppointmentStatus status) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
        
        appointment.setStatus(status);
        
        Appointment updatedAppointment = appointmentRepository.save(appointment);
        
        // Create notification for the patient
        if (updatedAppointment.getPatient() != null) {
            String message = "Your appointment status has been updated to " + status + " by Dr. " + 
                             updatedAppointment.getDoctor().getNom();
            String link = "/patient/appointments/" + updatedAppointment.getId();
            notificationService.createNotification(
                updatedAppointment.getPatient(), 
                message, 
                Notification.NotificationType.APPOINTMENT_UPDATED,
                link
            );
        }
        
        return updatedAppointment;
    }
}