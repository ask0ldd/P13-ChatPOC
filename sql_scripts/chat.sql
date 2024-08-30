CREATE DATABASE chat;

USE chat;

CREATE TABLE Chatrooms (
    chatroom_id INT AUTO_INCREMENT PRIMARY KEY,
    owner_id INT NOT NULL UNIQUE, /* a user can only own his private chatroom */
    name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE ChatMessages (
    chatmessage_id INT AUTO_INCREMENT PRIMARY KEY,
    chatroom_id INT NOT NULL,
    sender_id INT NOT NULL,
    content TEXT NOT NULL,
    type ENUM('CHAT', 'JOIN', 'LEAVE') DEFAULT 'CHAT',
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (chatroom_id) REFERENCES Chatrooms(chatroom_id)
);