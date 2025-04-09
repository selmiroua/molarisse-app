DESCRIBE role;

-- Insert doctor role if it doesn't exist
INSERT INTO role (nom) SELECT 'DOCTOR' WHERE NOT EXISTS (SELECT 1 FROM role WHERE nom = 'DOCTOR');

-- Insert a doctor user if it doesn't exist
INSERT INTO users (email, nom, prenom, password, address, phone_number, date_naissance)
SELECT 'doctor@example.com', 'Doctor', 'Test', '$2a$10$X7G3Y5J8K2L1M4N6P7Q9R0S1T2U3V4W5X6Y7Z8A9B0C1D2E3F4G5H6I7J8K9L0', '123 Doctor Street', '1234567890', '1990-01-01'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'doctor@example.com');

-- Get the doctor role and user IDs
SET @doctorRoleId = (SELECT id FROM role WHERE nom = 'DOCTOR');
SET @doctorUserId = (SELECT id FROM users WHERE email = 'doctor@example.com');

-- Link the doctor user to the doctor role if not already linked
INSERT INTO user_roles (user_id, role_id)
SELECT @doctorUserId, @doctorRoleId
WHERE NOT EXISTS (SELECT 1 FROM user_roles WHERE user_id = @doctorUserId AND role_id = @doctorRoleId);