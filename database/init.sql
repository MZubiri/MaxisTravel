-- ============================================
-- MaxisTravel Cusco - Database Initialization
-- ============================================
-- This file is used by Docker to initialize the database
-- EF Core will handle the actual schema creation via EnsureCreated()

CREATE DATABASE IF NOT EXISTS maxis_travel
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE maxis_travel;

-- Grant privileges to the application user
GRANT ALL PRIVILEGES ON maxis_travel.* TO 'maxis_user'@'%';
FLUSH PRIVILEGES;
