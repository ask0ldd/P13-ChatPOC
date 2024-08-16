CREATE TABLE Addresses(
    address_id INT AUTO_INCREMENT PRIMARY KEY,
    street_address VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    country VARCHAR(100) NOT NULL
);

CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    lastname VARCHAR(50) NOT NULL,
    firstname VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone_number VARCHAR(20),
    role ENUM('ADMIN', 'SUPPORT', 'CUSTOMER') DEFAULT 'CUSTOMER',
    birthdate DATE NOT NULL,
    address_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (address_id) REFERENCES Addresses(address_id)
);

CREATE TABLE Chatrooms (
    chatroom_id INT AUTO_INCREMENT PRIMARY KEY,
    owner_id INT NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL UNIQUE,
    FOREIGN KEY (owner_id) REFERENCES Users(user_id)
);

CREATE TABLE CarMakes (
    make_id INT AUTO_INCREMENT PRIMARY KEY,
    make VARCHAR(50) NOT NULL UNIQUE,
    make_logo_url VARCHAR(255) NOT NULL
);

CREATE TABLE CarModels (
    model_id INT AUTO_INCREMENT PRIMARY KEY,
    make_id INT NOT NULL,
    model VARCHAR(50) NOT NULL,
    description VARCHAR(100) NOT NULL,
    acriss_category CHAR(1) NOT NULL,
    acriss_type CHAR(1) NOT NULL,
    acriss_transmission CHAR(1) NOT NULL,
    acriss_fuel_aircon CHAR(1) NOT NULL,
    FOREIGN KEY (make_id) REFERENCES CarMakes(make_id)
);

CREATE TABLE CarPictures (
    picture_id INT AUTO_INCREMENT PRIMARY KEY,
    url VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE Cars (
    car_id INT AUTO_INCREMENT PRIMARY KEY,
    model_id INT NOT NULL,
    year INT NOT NULL,
    color VARCHAR(50) NOT NULL,
    registration_number VARCHAR(20) NOT NULL UNIQUE,
    daily_rate DECIMAL(10, 2) NOT NULL,
    available BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (model_id) REFERENCES CarModels(model_id)
);

CREATE TABLE CarPictureCarJunction(
    junction_id INT AUTO_INCREMENT PRIMARY KEY,
    picture_id INT NOT NULL,
    car_id INT NOT NULL,
    FOREIGN KEY (picture_id) REFERENCES CarPictures(picture_id),
    FOREIGN KEY (car_id) REFERENCES Cars(car_id)
);

CREATE TABLE RentalOffices (
    rentaloffice_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    address_id INT NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    email VARCHAR(100) NOT NULL,
    opening_hours VARCHAR(100),
    FOREIGN KEY (address_id) REFERENCES Addresses(address_id)
);

CREATE TABLE Pickups (
    pickup_id INT AUTO_INCREMENT PRIMARY KEY,
    /*rental_id INT NOT NULL,*/
    rentaloffice_id INT NOT NULL,
    date DATE NOT NULL,
    /*FOREIGN KEY (rental_id) REFERENCES Rentals(rental_id),*/
    FOREIGN KEY (rentaloffice_id) REFERENCES RentalOffices(rentaloffice_id)
);

CREATE TABLE Dropoffs (
    dropoff_id INT AUTO_INCREMENT PRIMARY KEY,
    /*rental_id INT NOT NULL,*/
    rentaloffice_id INT NOT NULL,
    date DATE NOT NULL,
    /*FOREIGN KEY (rental_id) REFERENCES Rentals(rental_id),*/
    FOREIGN KEY (rentaloffice_id) REFERENCES RentalOffices(rentaloffice_id)
);

CREATE TABLE Rentals (
    rental_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    car_id INT NOT NULL,
    pickup_id INT NOT NULL,
    dropoff_id INT NOT NULL,
    total_cost DECIMAL(10, 2) NOT NULL,
    status ENUM('reserved', 'in_progress', 'completed', 'canceled') DEFAULT 'reserved',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (car_id) REFERENCES Cars(car_id)
    FOREIGN KEY (pickup_id) REFERENCES Pickups(pickup_id)
    FOREIGN KEY (dropoff_id) REFERENCES Dropoffs(dropoff_id)
);

/*ALTER TABLE Rentals
ADD CONSTRAINT fk_rental_dropoff
FOREIGN KEY (dropoff_id) REFERENCES Dropoffs(dropoff_id);

ALTER TABLE Rentals
ADD CONSTRAINT fk_rental_pickup
FOREIGN KEY (pickup_id) REFERENCES Pickups(pickup_id);*/

CREATE TABLE ChatMessages (
    chatmessage_id INT AUTO_INCREMENT PRIMARY KEY,
    chatroom_id INT NOT NULL,
    sender_id INT NOT NULL,
    content TEXT NOT NULL,
    type ENUM('CHAT', 'JOIN', 'LEAVE'),
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (chatroom_id) REFERENCES Chatrooms(chatroom_id),
    FOREIGN KEY (sender_id) REFERENCES Users(user_id)
);

CREATE TABLE Messages (
    message_id INT AUTO_INCREMENT PRIMARY KEY,
    sender_id INT NOT NULL,
    receiver_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    attacheddoc_url VARCHAR(255),
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES Users(user_id),
    FOREIGN KEY (receiver_id) REFERENCES Users(user_id)
);

CREATE TABLE Payments (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    rental_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_method ENUM('credit_card', 'debit_card', 'paypal') NOT NULL,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (rental_id) REFERENCES Rentals(rental_id)
);