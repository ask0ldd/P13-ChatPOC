CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    lastname VARCHAR(50) NOT NULL,
    firstname VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone_number VARCHAR(15),
    role ENUM("ADMIN", "SUPPORT", "CUSTOMER"),
    chatroom_id VARCHAR(255) NOT NULL,
    birthdate DATE,
    street_address VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    zip_code VARCHAR(20),
    country VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE CarMakes (
    make_id INT AUTO_INCREMENT PRIMARY KEY,
    make VARCHAR(50) NOT NULL UNIQUE,
    make_logo_url VARCHAR(255) NOT NULL
);

CREATE TABLE CarModels (
    model_id INT AUTO_INCREMENT PRIMARY KEY,
    make_id INT,
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
    model_id INT NOT NULL,
    url VARCHAR(50) NOT NULL,
    FOREIGN KEY (model_id) REFERENCES CarModels(model_id)
);

CREATE TABLE Cars (
    car_id INT AUTO_INCREMENT PRIMARY KEY,
    model_id INT,
    year INT NOT NULL,
    color VARCHAR(50) NOT NULL,
    registration_number VARCHAR(20) NOT NULL UNIQUE,
    daily_rate DECIMAL(10, 2) NOT NULL,
    available BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (model_id) REFERENCES CarModels(model_id)
);

CREATE TABLE Rentals (
    rental_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    car_id INT NOT NULL,
    pickup_office_id INT NOT NULL,
    dropoff_office_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_cost DECIMAL(10, 2) NOT NULL,
    status ENUM('reserved', 'in_progress', 'completed', 'canceled') DEFAULT 'reserved',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (car_id) REFERENCES Cars(car_id),
    FOREIGN KEY (pickup_office_id) REFERENCES RentalOffices(rentaloffice_id),
    FOREIGN KEY (dropoff_office_id) REFERENCES RentalOffices(rentaloffice_id)
);

CREATE TABLE RentalOffices (
    rentaloffice_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    city VARCHAR(50) NOT NULL,
    address VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    phone_number VARCHAR(20),
    email VARCHAR(50),
    opening_hours VARCHAR(100)
);

CREATE TABLE ChatMessages (
    chatmessage_id INT AUTO_INCREMENT PRIMARY KEY,
    chatroom_id VARCHAR(255) NOT NULL,
    sender_id INT NOT NULL,
    content TEXT NOT NULL,
    type ENUM("CHAT", "JOIN", "LEAVE"),
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (chatroom_id) REFERENCES Users(chatroom_id),
    FOREIGN KEY (sender_id) REFERENCES Users(user_id)
);

CREATE TABLE Messages (
    message_id INT AUTO_INCREMENT PRIMARY KEY,
    sender_id INT NOT NULL,
    receiver_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    attacheddoc_url TEXT NOT NULL,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES Users(user_id)
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