CREATE DATABASE rentaloffices;

USE rentaloffices;

CREATE TABLE RentalOffices (
    rentaloffice_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    address_id INT NOT NULL,
    phone_number VARCHAR(20) NOT NULL, /* shouldn't be unique, multiple offices can have the same number */
    email VARCHAR(100) NOT NULL, /* shouldn't be unique, multiple offices can have the same email */
    opening_hours VARCHAR(100)
);