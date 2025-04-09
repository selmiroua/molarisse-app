import { Role } from "./role.model"; // Assuming Role model exists

export interface Doctor {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  dateNaissance?: string; // Optional as it might not always be needed/sent
  address?: string;      // Optional
  phoneNumber?: string;  // Optional
  profilePicturePath?: string; // Optional
  enabled: boolean;
  role: Role;           // Include Role details
  // Add other relevant fields from User entity as needed
}