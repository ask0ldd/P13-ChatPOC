CREATE DATABASE rentals;

USE rentals;

CREATE TABLE Rentals (
    rental_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    car_id INT NOT NULL,
    pickup_id INT NOT NULL,
    dropoff_id INT NOT NULL,
    total_cost DECIMAL(10, 2) NOT NULL,
    status ENUM('RESERVED', 'IN_PROGRESS', 'COMPLETED', 'CANCELED') DEFAULT 'RESERVED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (pickup_id) REFERENCES Pickups(pickup_id),
    FOREIGN KEY (dropoff_id) REFERENCES Dropoffs(dropoff_id)
);

CREATE TABLE Pickups (
    pickup_id INT AUTO_INCREMENT PRIMARY KEY,
    rentaloffice_id INT NOT NULL,
    date DATE NOT NULL
);

CREATE TABLE Dropoffs (
    dropoff_id INT AUTO_INCREMENT PRIMARY KEY,
    rentaloffice_id INT NOT NULL,
    date DATE NOT NULL
);
