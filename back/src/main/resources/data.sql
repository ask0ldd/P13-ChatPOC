INSERT INTO `users` (`username`, `email`, `password`, `role`, `created_at`, `updated_at`) VALUES ('guest', 'guest@poc.com', 'admin', 'CUSTOMER', CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());
INSERT INTO `users` (`username`, `email`, `password`, `role`, `created_at`, `updated_at`) VALUES ('guest2', 'guest2@poc.com', 'admin', 'CUSTOMER', CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());
INSERT INTO `users` (`username`, `email`, `password`, `role`, `created_at`, `updated_at`) VALUES ('admin', 'admin@poc.com', 'admin', 'ADMIN', CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());
INSERT INTO `chatrooms` (`user_id`, `name`) VALUES (1, 'guestroom1');
INSERT INTO `chatrooms` (`user_id`, `name`) VALUES (2, 'guestroom2');
INSERT INTO `chatrooms` (`user_id`, `name`) VALUES (3, 'adminroom1');