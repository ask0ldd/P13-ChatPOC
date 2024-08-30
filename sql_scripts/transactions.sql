CREATE DATABASE transactions;

USE transactions;

CREATE TABLE Payments (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    rental_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_method ENUM('CREDIT_CARD', 'DEBIT_CARD', 'PAYPAL') DEFAULT 'CREDIT_CARD',
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    stripe_transaction_id VARCHAR(64) NOT NULL
);

CREATE TABLE Refunds (
    refund_id INT AUTO_INCREMENT PRIMARY KEY,
    rental_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    refund_method ENUM('CREDIT_CARD', 'DEBIT_CARD', 'PAYPAL') DEFAULT 'CREDIT_CARD',
    refund_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    stripe_transaction_id VARCHAR(64) NOT NULL
);