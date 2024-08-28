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
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (address_id) REFERENCES Addresses(address_id)
);

CREATE TABLE Chatrooms (
    chatroom_id INT AUTO_INCREMENT PRIMARY KEY,
    owner_id INT NOT NULL UNIQUE, /* a user can only own his private chatroom */
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
    description VARCHAR(255) NOT NULL,
    acriss_category CHAR(1) NOT NULL,
    acriss_type CHAR(1) NOT NULL,
    acriss_transmission CHAR(1) NOT NULL,
    acriss_fuel_aircon CHAR(1) NOT NULL,
    FOREIGN KEY (make_id) REFERENCES CarMakes(make_id)
);

CREATE TABLE Reviews (
    review_id INT AUTO_INCREMENT PRIMARY KEY,
    model_id INT NOT NULL,
    user_id INT NOT NULL,
    score INT NOT NULL CHECK (score BETWEEN 1 AND 10),
    text VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (rental_id) REFERENCES Rentals(rental_id)
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

/* 2 cars can share the same pictures */

CREATE TABLE CarPictureCarJunction(
    junction_id INT AUTO_INCREMENT PRIMARY KEY,
    picture_id INT NOT NULL,
    car_id INT NOT NULL,
    FOREIGN KEY (picture_id) REFERENCES CarPictures(picture_id),
    FOREIGN KEY (car_id) REFERENCES Cars(car_id),
    UNIQUE(picture_id, car_id)
);

CREATE TABLE RentalOffices (
    rentaloffice_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    address_id INT NOT NULL,
    phone_number VARCHAR(20) NOT NULL, /* shouldn't be unique, multiple offices can have the same number */
    email VARCHAR(100) NOT NULL, /* shouldn't be unique, multiple offices can have the same email */
    opening_hours VARCHAR(100),
    FOREIGN KEY (address_id) REFERENCES Addresses(address_id)
);

CREATE TABLE Pickups (
    pickup_id INT AUTO_INCREMENT PRIMARY KEY,
    rentaloffice_id INT NOT NULL,
    date DATE NOT NULL,
    FOREIGN KEY (rentaloffice_id) REFERENCES RentalOffices(rentaloffice_id)
);

CREATE TABLE Dropoffs (
    dropoff_id INT AUTO_INCREMENT PRIMARY KEY,
    rentaloffice_id INT NOT NULL,
    date DATE NOT NULL,
    FOREIGN KEY (rentaloffice_id) REFERENCES RentalOffices(rentaloffice_id)
);

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
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (car_id) REFERENCES Cars(car_id),
    FOREIGN KEY (pickup_id) REFERENCES Pickups(pickup_id),
    FOREIGN KEY (dropoff_id) REFERENCES Dropoffs(dropoff_id)
);

CREATE TABLE ChatMessages (
    chatmessage_id INT AUTO_INCREMENT PRIMARY KEY,
    chatroom_id INT NOT NULL,
    sender_id INT NOT NULL,
    content TEXT NOT NULL,
    type ENUM('CHAT', 'JOIN', 'LEAVE') DEFAULT 'CHAT',
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (chatroom_id) REFERENCES Chatrooms(chatroom_id),
    FOREIGN KEY (sender_id) REFERENCES Users(user_id)
);

CREATE TABLE Messages (
    message_id INT AUTO_INCREMENT PRIMARY KEY,
    sender_id INT NOT NULL,
    receiver_id INT NOT NULL,
    title VARCHAR(100) NOT NULL,
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
    payment_method ENUM('CREDIT_CARD', 'DEBIT_CARD', 'PAYPAL') DEFAULT 'CREDIT_CARD',
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    stripe_transaction_id VARCHAR(64) NOT NULL,
    FOREIGN KEY (rental_id) REFERENCES Rentals(rental_id)
);

CREATE TABLE Refunds (
    refund_id INT AUTO_INCREMENT PRIMARY KEY,
    rental_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    refund_method ENUM('CREDIT_CARD', 'DEBIT_CARD', 'PAYPAL') DEFAULT 'CREDIT_CARD',
    refund_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    stripe_transaction_id VARCHAR(64) NOT NULL,
    FOREIGN KEY (rental_id) REFERENCES Rentals(rental_id)
);

CREATE TABLE CarPositions(
    carposition_id INT AUTO_INCREMENT PRIMARY KEY,
    car_id INT NOT NULL,
    rentaloffice_id INT NOT NULL,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (car_id) REFERENCES Cars(car_id),
    FOREIGN KEY (rentaloffice_id) REFERENCES RentalOffices(rentaloffice_id),
);