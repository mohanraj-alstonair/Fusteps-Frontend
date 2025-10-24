-- Create Django system tables manually
USE registered_candidate;

-- Create django_content_type table
CREATE TABLE IF NOT EXISTS django_content_type (
    id INT AUTO_INCREMENT PRIMARY KEY,
    app_label VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    UNIQUE KEY django_content_type_app_label_model_76bd3d3b_uniq (app_label, model)
);

-- Create django_migrations table
CREATE TABLE IF NOT EXISTS django_migrations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    app VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    applied DATETIME(6) NOT NULL
);

-- Create auth_permission table
CREATE TABLE IF NOT EXISTS auth_permission (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    content_type_id INT NOT NULL,
    codename VARCHAR(100) NOT NULL,
    UNIQUE KEY auth_permission_content_type_id_codename_01ab375a_uniq (content_type_id, codename),
    KEY auth_permission_content_type_id_2f476e4b (content_type_id)
);

-- Create auth_group table
CREATE TABLE IF NOT EXISTS auth_group (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL UNIQUE
);

-- Create auth_group_permissions table
CREATE TABLE IF NOT EXISTS auth_group_permissions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    group_id INT NOT NULL,
    permission_id INT NOT NULL,
    UNIQUE KEY auth_group_permissions_group_id_permission_id_0cd325b0_uniq (group_id, permission_id),
    KEY auth_group_permissions_group_id_b120cbf9 (group_id),
    KEY auth_group_permissions_permission_id_84c5c92e (permission_id)
);

-- Create auth_user table
CREATE TABLE IF NOT EXISTS auth_user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    password VARCHAR(128) NOT NULL,
    last_login DATETIME(6) NULL,
    is_superuser TINYINT(1) NOT NULL,
    username VARCHAR(150) NOT NULL UNIQUE,
    first_name VARCHAR(150) NOT NULL,
    last_name VARCHAR(150) NOT NULL,
    email VARCHAR(254) NOT NULL,
    is_staff TINYINT(1) NOT NULL,
    is_active TINYINT(1) NOT NULL,
    date_joined DATETIME(6) NOT NULL
);

-- Create auth_user_groups table
CREATE TABLE IF NOT EXISTS auth_user_groups (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    group_id INT NOT NULL,
    UNIQUE KEY auth_user_groups_user_id_group_id_94350c0c_uniq (user_id, group_id),
    KEY auth_user_groups_user_id_6a12ed8b (user_id),
    KEY auth_user_groups_group_id_97559544 (group_id)
);

-- Create auth_user_user_permissions table
CREATE TABLE IF NOT EXISTS auth_user_user_permissions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    permission_id INT NOT NULL,
    UNIQUE KEY auth_user_user_permissions_user_id_permission_id_14a6b632_uniq (user_id, permission_id),
    KEY auth_user_user_permissions_user_id_a95ead1b (user_id),
    KEY auth_user_user_permissions_permission_id_1fbb5f2c (permission_id)
);

-- Create django_admin_log table
CREATE TABLE IF NOT EXISTS django_admin_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    action_time DATETIME(6) NOT NULL,
    object_id LONGTEXT,
    object_repr VARCHAR(200) NOT NULL,
    action_flag SMALLINT UNSIGNED NOT NULL,
    change_message LONGTEXT NOT NULL,
    content_type_id INT,
    user_id INT NOT NULL,
    KEY django_admin_log_content_type_id_c4bce8eb (content_type_id),
    KEY django_admin_log_user_id_c564eba6 (user_id)
);

-- Create django_session table
CREATE TABLE IF NOT EXISTS django_session (
    session_key VARCHAR(40) NOT NULL PRIMARY KEY,
    session_data LONGTEXT NOT NULL,
    expire_date DATETIME(6) NOT NULL,
    KEY django_session_expire_date_a5c62663 (expire_date)
);