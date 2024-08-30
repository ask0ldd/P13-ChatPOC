CREATE DATABASE cars;

USE cars;

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

CREATE TABLE ModelReviews (
    review_id INT AUTO_INCREMENT PRIMARY KEY,
    model_id INT NOT NULL,
    user_id INT NOT NULL,
    score INT NOT NULL CHECK (score BETWEEN 1 AND 10),
    text VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (model_id) REFERENCES CarModels(model_id)
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

CREATE TABLE CarPositions(
    carposition_id INT AUTO_INCREMENT PRIMARY KEY,
    car_id INT NOT NULL,
    rentaloffice_id INT NOT NULL,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (car_id) REFERENCES Cars(car_id)
);

CREATE TABLE CarPictures (
    picture_id INT AUTO_INCREMENT PRIMARY KEY,
    url VARCHAR(255) NOT NULL UNIQUE
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
