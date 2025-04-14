package com.projet.molarisse.appointment;

import com.projet.molarisse.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/appointments")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentService appointmentService;

    @PostMapping("/book")
    @PreAuthorize("hasAuthority('ROLE_PATIENT')")
    public ResponseEntity<Appointment> bookAppointment(@RequestBody AppointmentRequest request) {
        Appointment appointment = appointmentService.bookAppointment(
                request.getPatientId(),
                request.getDoctorId(),
                request.getAppointmentDateTime(),
                request.getCaseType(),
                request.getAppointmentType(),
                request.getNotes());
        return ResponseEntity.ok(appointment);
    }

  


    @GetMapping("/my-doctor-appointments")
    @PreAuthorize("hasAuthority('ROLE_doctor')")
    public ResponseEntity<List<Map<String, Object>>> getMyDoctorAppointments() {
        // Get the authenticated doctor
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User doctor = (User) authentication.getPrincipal();
        Integer doctorId = doctor.getId();
        
        List<Appointment> appointments = appointmentService.getAppointmentsForDoctor(doctorId);
        
        List<Map<String, Object>> simplifiedAppointments = appointments.stream()
            .map(appointment -> {
                Map<String, Object> simplified = new HashMap<>();
                simplified.put("id", appointment.getId());
                simplified.put("appointmentDateTime", appointment.getAppointmentDateTime());
                simplified.put("status", appointment.getStatus());
                simplified.put("appointmentType", appointment.getAppointmentType());
                simplified.put("caseType", appointment.getCaseType());
                simplified.put("notes", appointment.getNotes());
                
                if (appointment.getPatient() != null) {
                    Map<String, Object> patient = new HashMap<>();
                    patient.put("id", appointment.getPatient().getId());
                    patient.put("nom", appointment.getPatient().getNom());
                    patient.put("prenom", appointment.getPatient().getPrenom());
                    patient.put("email", appointment.getPatient().getEmail());
                    patient.put("phoneNumber", appointment.getPatient().getPhoneNumber());
                    simplified.put("patient", patient);
                }
                
                return simplified;
            })
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(simplifiedAppointments);
    }

   

    @GetMapping("/my-secretary-appointments")
    //@PreAuthorize("hasRole('SECRETAIRE')")
    public ResponseEntity<List<Map<String, Object>>> getMySecretaryAppointments() {
        // Get the authenticated secretary
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User secretary = (User) authentication.getPrincipal();
        Integer secretaryId = secretary.getId();
        
        List<Appointment> appointments = appointmentService.getAppointmentsForSecretary(secretaryId);
        
        List<Map<String, Object>> simplifiedAppointments = appointments.stream()
            .map(appointment -> {
                Map<String, Object> simplified = new HashMap<>();
                simplified.put("id", appointment.getId());
                simplified.put("appointmentDateTime", appointment.getAppointmentDateTime());
                simplified.put("status", appointment.getStatus());
                simplified.put("appointmentType", appointment.getAppointmentType());
                simplified.put("caseType", appointment.getCaseType());
                simplified.put("notes", appointment.getNotes());
                
                if (appointment.getPatient() != null) {
                    Map<String, Object> patient = new HashMap<>();
                    patient.put("id", appointment.getPatient().getId());
                    patient.put("nom", appointment.getPatient().getNom());
                    patient.put("prenom", appointment.getPatient().getPrenom());
                    patient.put("email", appointment.getPatient().getEmail());
                    patient.put("phoneNumber", appointment.getPatient().getPhoneNumber());
                    simplified.put("patient", patient);
                }
                
                if (appointment.getDoctor() != null) {
                    Map<String, Object> doctor = new HashMap<>();
                    doctor.put("id", appointment.getDoctor().getId());
                    doctor.put("nom", appointment.getDoctor().getNom());
                    doctor.put("prenom", appointment.getDoctor().getPrenom());
                    doctor.put("email", appointment.getDoctor().getEmail());
                    doctor.put("phoneNumber", appointment.getDoctor().getPhoneNumber());
                    simplified.put("doctor", doctor);
                }
                
                return simplified;
            })
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(simplifiedAppointments);
    }

   
    @PutMapping("/update-status")
    @PreAuthorize("hasAnyAuthority('ROLE_SECRETAIRE', 'ROLE_doctor')")
    public ResponseEntity<Appointment> updateAppointmentStatusSimple(
            @RequestParam Integer appointmentId,
            @RequestBody StatusUpdateRequest statusUpdate) {
        Appointment appointment = appointmentService.updateAppointmentStatus(
                appointmentId, 
                statusUpdate.getStatus(), 
                statusUpdate.getSecretaryId());
        return ResponseEntity.ok(appointment);
    }

    @PutMapping("/update-my-appointment-status")
    @PreAuthorize("hasAuthority('ROLE_doctor')")
    public ResponseEntity<Appointment> updateMyAppointmentStatus(
            @RequestParam Integer appointmentId,
            @RequestBody Map<String, String> request) {
        // Get the authenticated doctor
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) authentication.getPrincipal();
        
        // Parse the status from the request
        Appointment.AppointmentStatus status = Appointment.AppointmentStatus.valueOf(request.get("status"));
        
        // Use the doctor's ID to update the status
        Appointment appointment = appointmentService.updateAppointmentStatusByDoctor(
                appointmentId, 
                status);
        return ResponseEntity.ok(appointment);
    }

    @GetMapping("/my-appointments")
    @PreAuthorize("hasAuthority('ROLE_PATIENT')")
    public ResponseEntity<List<Map<String, Object>>> getMyAppointments() {
        // Get the authenticated user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) authentication.getPrincipal();
        Integer patientId = user.getId();
        
        List<Appointment> appointments = appointmentService.getAppointmentsForPatient(patientId);
        
        List<Map<String, Object>> simplifiedAppointments = appointments.stream()
            .map(appointment -> {
                Map<String, Object> simplified = new HashMap<>();
                simplified.put("id", appointment.getId());
                simplified.put("appointmentDateTime", appointment.getAppointmentDateTime());
                simplified.put("status", appointment.getStatus());
                simplified.put("appointmentType", appointment.getAppointmentType());
                simplified.put("caseType", appointment.getCaseType());
                simplified.put("notes", appointment.getNotes());
                
                if (appointment.getDoctor() != null) {
                    Map<String, Object> doctor = new HashMap<>();
                    doctor.put("id", appointment.getDoctor().getId());
                    doctor.put("nom", appointment.getDoctor().getNom());
                    doctor.put("prenom", appointment.getDoctor().getPrenom());
                    doctor.put("email", appointment.getDoctor().getEmail());
                    doctor.put("phoneNumber", appointment.getDoctor().getPhoneNumber());
                    simplified.put("doctor", doctor);
                }
                
                return simplified;
            })
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(simplifiedAppointments);
    }

    // Keep the old method for backward compatibility but make it admin-only
    @GetMapping("/patient/{patientId}/simplified")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<List<Map<String, Object>>> getPatientAppointmentsSimplified(@PathVariable Integer patientId) {
        List<Appointment> appointments = appointmentService.getAppointmentsForPatient(patientId);
        
        List<Map<String, Object>> simplifiedAppointments = appointments.stream()
            .map(appointment -> {
                Map<String, Object> simplified = new HashMap<>();
                simplified.put("id", appointment.getId());
                simplified.put("appointmentDateTime", appointment.getAppointmentDateTime());
                simplified.put("status", appointment.getStatus());
                simplified.put("appointmentType", appointment.getAppointmentType());
                simplified.put("caseType", appointment.getCaseType());
                simplified.put("notes", appointment.getNotes());
                
                if (appointment.getDoctor() != null) {
                    Map<String, Object> doctor = new HashMap<>();
                    doctor.put("id", appointment.getDoctor().getId());
                    doctor.put("nom", appointment.getDoctor().getNom());
                    doctor.put("prenom", appointment.getDoctor().getPrenom());
                    doctor.put("email", appointment.getDoctor().getEmail());
                    doctor.put("phoneNumber", appointment.getDoctor().getPhoneNumber());
                    simplified.put("doctor", doctor);
                }
                
                return simplified;
            })
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(simplifiedAppointments);
    }
}