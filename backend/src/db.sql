-- 1. Master Vessels
CREATE TABLE
  IF NOT EXISTS `vessels` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL UNIQUE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- 2. Master Specification Groups
CREATE TABLE
  IF NOT EXISTS `specification_groups` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `group_no` VARCHAR(50) NULL,
    `sort_order` INT DEFAULT 0,
    `is_frontpage` BOOLEAN DEFAULT FALSE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_name` (`name`),
    INDEX `idx_group_no` (`group_no`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- 3. Pivot Specification Groups & Vessels
CREATE TABLE
  IF NOT EXISTS `specification_group_vessels` (
    `specification_group_id` INT UNSIGNED NOT NULL,
    `vessel_id` INT UNSIGNED NOT NULL,
    PRIMARY KEY (`specification_group_id`, `vessel_id`),
    CONSTRAINT `fk_sgv_group` FOREIGN KEY (`specification_group_id`) REFERENCES `specification_groups` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_sgv_vessel` FOREIGN KEY (`vessel_id`) REFERENCES `vessels` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- 4. Master Checklists & Checklist Items
CREATE TABLE
  IF NOT EXISTS `checklists` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE TABLE
  IF NOT EXISTS `checklist_items` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `checklist_id` INT UNSIGNED NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `data_type` ENUM (
      'Status',
      'Number field',
      'Text field',
      'Meter Reading',
      'Multiple Choice',
      'Inspection Check'
    ) NOT NULL,
    `sort_order` INT UNSIGNED NOT NULL DEFAULT 1,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_ci_checklist` FOREIGN KEY (`checklist_id`) REFERENCES `checklists` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- 5. Master Machinery Groups & Machineries
CREATE TABLE
  IF NOT EXISTS `machinery_groups` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(150) NOT NULL UNIQUE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE TABLE
  IF NOT EXISTS `machineries` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `machinery_group_id` INT UNSIGNED NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `code` VARCHAR(100) NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_machinery_group` FOREIGN KEY (`machinery_group_id`) REFERENCES `machinery_groups` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- 6. Work Order Masters & Child Tables
CREATE TABLE
  IF NOT EXISTS `work_order_masters` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `vessel_id` INT UNSIGNED NULL,
    `machinery_group_id` INT UNSIGNED NULL,
    `machinery_id` INT UNSIGNED NULL,
    `specification_group_id` INT UNSIGNED NOT NULL,
    `job_code` VARCHAR(50) NULL,
    `job_name` VARCHAR(255) NOT NULL,
    `job_category` ENUM ('Check', 'Inspection', 'Lubrication', 'Deck') NULL,
    `job_type` ENUM ('PMS Job', 'UPM Job', 'Dock Job', 'Time') NOT NULL DEFAULT 'PMS Job',
    `job_description` TEXT NOT NULL,
    `is_critical_job` BOOLEAN NOT NULL DEFAULT FALSE,
    `is_internal_job` BOOLEAN NOT NULL DEFAULT FALSE,
    `estimated_hours` DECIMAL(8, 2) DEFAULT 0.00,
    `responsible_rank` VARCHAR(100) NULL DEFAULT 'Chief Officer',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_wom_vessel` FOREIGN KEY (`vessel_id`) REFERENCES `vessels` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT `fk_wom_machinery_group` FOREIGN KEY (`machinery_group_id`) REFERENCES `machinery_groups` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT `fk_wom_machinery` FOREIGN KEY (`machinery_id`) REFERENCES `machineries` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT `fk_wom_spec_group` FOREIGN KEY (`specification_group_id`) REFERENCES `specification_groups` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE TABLE
  IF NOT EXISTS `work_order_sub_jobs` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `work_order_id` INT UNSIGNED NOT NULL,
    `description` VARCHAR(255) NOT NULL,
    `sort_order` INT UNSIGNED NOT NULL DEFAULT 1,
    `is_internal_job` BOOLEAN NOT NULL DEFAULT FALSE,
    `total_budget` DECIMAL(14, 2) NOT NULL DEFAULT 0.00,
    `yard_estimates` DECIMAL(14, 2) NOT NULL DEFAULT 0.00,
    `owner_estimate` DECIMAL(14, 2) NOT NULL DEFAULT 0.00,
    `internal_comment` TEXT NULL,
    `responsible_rank` VARCHAR(100) NULL,
    `quantity` DECIMAL(10, 2) NOT NULL DEFAULT 1.00,
    `unit` VARCHAR(20) NOT NULL DEFAULT 'PCS',
    `account` VARCHAR(50) NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_wosj_work_order` FOREIGN KEY (`work_order_id`) REFERENCES `work_order_masters` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE TABLE
  IF NOT EXISTS `work_order_spares` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `work_order_id` INT UNSIGNED NOT NULL,
    `spare_name` VARCHAR(255) NOT NULL,
    `expected_qty` INT UNSIGNED NOT NULL DEFAULT 1,
    `cost_usd` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_wosp_work_order` FOREIGN KEY (`work_order_id`) REFERENCES `work_order_masters` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE TABLE
  IF NOT EXISTS `work_order_checklists` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `work_order_id` INT UNSIGNED NOT NULL,
    `checklist_id` INT UNSIGNED NOT NULL,
    `checklist_name` VARCHAR(255) NOT NULL,
    `checklist_description` TEXT NULL,
    `remarks` TEXT NULL,
    `is_completed` BOOLEAN NOT NULL DEFAULT FALSE,
    `completed_date` DATETIME NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_woc_work_order` FOREIGN KEY (`work_order_id`) REFERENCES `work_order_masters` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_woc_checklist` FOREIGN KEY (`checklist_id`) REFERENCES `checklists` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE TABLE
  IF NOT EXISTS `work_order_checklist_values` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `work_order_checklist_id` INT UNSIGNED NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `data_type` ENUM (
      'Status',
      'Number field',
      'Text field',
      'Meter Reading',
      'Multiple Choice',
      'Inspection Check'
    ) NOT NULL,
    `answer_value` TEXT NULL,
    `sort_order` INT UNSIGNED NOT NULL DEFAULT 1,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_wocv_header` FOREIGN KEY (`work_order_checklist_id`) REFERENCES `work_order_checklists` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE TABLE
  IF NOT EXISTS `work_order_tasks` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `work_order_id` INT UNSIGNED NOT NULL,
    `task_type` VARCHAR(100) NOT NULL,
    `responsibility` VARCHAR(100) NOT NULL,
    `due_date` DATE NOT NULL,
    `description` TEXT NOT NULL,
    `status` ENUM ('Open', 'In Progress', 'Closed') NOT NULL DEFAULT 'Open',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_wot_work_order` FOREIGN KEY (`work_order_id`) REFERENCES `work_order_masters` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE TABLE
  IF NOT EXISTS `work_order_purchase_orders` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `work_order_id` INT UNSIGNED NOT NULL,
    `category` ENUM ('Inventory', 'Spare part', 'Machinery') NOT NULL,
    `purchase_order_no` VARCHAR(100) NOT NULL,
    `supplier` VARCHAR(255) NOT NULL,
    `total_usd` DECIMAL(14, 2) NOT NULL DEFAULT 0.00,
    `is_approved` BOOLEAN NOT NULL DEFAULT FALSE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_wopo_work_order` FOREIGN KEY (`work_order_id`) REFERENCES `work_order_masters` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- 7. Master Dry Docks & Link Specifications
CREATE TABLE
  IF NOT EXISTS `dry_docks` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `vessel_id` INT UNSIGNED NOT NULL,
    `dock_list_no` VARCHAR(100) NOT NULL,
    `description` TEXT NOT NULL,
    `shipyard_name` VARCHAR(255) NULL,
    `details_of_shipyard` TEXT NULL,
    `planned_start_date` DATE NULL,
    `planned_end_date` DATE NULL,
    `actual_start_date` DATE NULL,
    `actual_end_date` DATE NULL,
    `account_code` VARCHAR(50) NULL,
    `budget` DECIMAL(14, 2) NOT NULL DEFAULT 0.00,
    `currency` VARCHAR(10) NOT NULL DEFAULT 'USD',
    `responsible_rank` VARCHAR(100) NULL,
    `status` ENUM ('Planning', 'Execution', 'Completed') NOT NULL DEFAULT 'Planning',
    `priority` ENUM ('Low', 'Medium', 'High') NOT NULL DEFAULT 'Medium',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_dd_vessel` FOREIGN KEY (`vessel_id`) REFERENCES `vessels` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE TABLE
  IF NOT EXISTS `dry_dock_work_orders` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `dry_dock_id` INT UNSIGNED NOT NULL,
    `work_order_id` INT UNSIGNED NOT NULL,
    `status` ENUM ('Open', 'In Progress', 'On Hold', 'Complete') NOT NULL DEFAULT 'Open',
    `actual_yard_costs` DECIMAL(14, 2) NOT NULL DEFAULT 0.00,
    `actual_owner_costs` DECIMAL(14, 2) NOT NULL DEFAULT 0.00,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_ddwo_dry_dock` FOREIGN KEY (`dry_dock_id`) REFERENCES `dry_docks` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_ddwo_work_order` FOREIGN KEY (`work_order_id`) REFERENCES `work_order_masters` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
    UNIQUE KEY `uk_dd_wo` (`dry_dock_id`, `work_order_id`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;