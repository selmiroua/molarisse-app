import { Role } from "./role.model"; // Assuming Role model exists

export interface Doctor {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  dateNaissance?: string; // Optional as it might not always be needed/sent
  address?: string;      // Optional
  phoneNumber?: string;  // Optional
  photoPath?: string;    // Updated to match backend DTO
  specialite?: string;
  ville?: string;
  nomCabinet?: string;
  enabled: boolean;
  role: Role;           // Include Role details
  anneeExperience?: number; // Optional: Years of experience
  prixConsultation?: number; // Optional: Consultation price
  disponibilite?: string; // Optional: Availability information
  aCabinet?: boolean;
  adresseCabinet?: string;
  villeCabinet?: string;
  codePostalCabinet?: string;
  autreSpecialite?: string;
  // Add other relevant fields from User entity as needed
}