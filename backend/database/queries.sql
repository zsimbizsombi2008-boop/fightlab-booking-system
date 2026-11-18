USE Fightlab;

SELECT * FROM bookings INNER JOIN users ON bookings.user_id = users.id  ORDER BY users.id DESC WHERE sport = "MMA" OR sport = "box"  


SELECT COUNT(*) FROM users


