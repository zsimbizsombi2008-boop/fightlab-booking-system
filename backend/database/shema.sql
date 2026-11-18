USE FightLab;

CREATE TABLE users(
id INT AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(255) not null,
email VARCHAR(255) UNIQUE not null,
phone VARCHAR(20) UNIQUE not null,
age INT not null,
city VARCHAR(100) not null,
note TEXT
);


CREATE TABLE bookings(
id INT AUTO_INCREMENT PRIMARY KEY,
sport VARCHAR(50) not null,
level VARCHAR(50) not null,
status ENUM("pending","confirmed") not NULL DEFAULT "pending",
user_id INT,
FOREIGN KEY(user_id) REFERENCES users(id)
);




