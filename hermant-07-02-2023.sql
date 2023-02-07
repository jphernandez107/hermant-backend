/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `construction_site` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `district` varchar(255) NOT NULL,
  `province` varchar(255) NOT NULL,
  `init_date` date DEFAULT NULL,
  `finish_date` date DEFAULT NULL,
  `max_temp` float DEFAULT NULL,
  `min_temp` float DEFAULT NULL,
  `altitude` float DEFAULT NULL,
  `dust` float DEFAULT NULL,
  `distance` float DEFAULT NULL,
  `observations` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `equipment` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(255) NOT NULL,
  `brand` varchar(255) NOT NULL,
  `model` varchar(255) DEFAULT NULL,
  `designation` varchar(255) DEFAULT NULL,
  `total_hours` int DEFAULT NULL,
  `partial_hours` int DEFAULT NULL,
  `serial_number` varchar(255) DEFAULT NULL,
  `origin` varchar(255) DEFAULT NULL,
  `manuf_date` date DEFAULT NULL,
  `service_date` date DEFAULT NULL,
  `power` int DEFAULT NULL,
  `weight` int DEFAULT NULL,
  `price` int DEFAULT NULL,
  `observations` text,
  `site_importance` int DEFAULT NULL,
  `lubrication_sheet_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  UNIQUE KEY `serial_number` (`serial_number`),
  KEY `lubrication_sheet_id` (`lubrication_sheet_id`),
  CONSTRAINT `equipment_ibfk_1` FOREIGN KEY (`lubrication_sheet_id`) REFERENCES `lubrication_sheet` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `equipment_construction_site` (
  `id` int NOT NULL AUTO_INCREMENT,
  `equipment_id` int NOT NULL,
  `construction_site_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `equipment_id` (`equipment_id`),
  KEY `construction_site_id` (`construction_site_id`),
  CONSTRAINT `equipment_construction_site_ibfk_1` FOREIGN KEY (`equipment_id`) REFERENCES `equipment` (`id`) ON DELETE CASCADE,
  CONSTRAINT `equipment_construction_site_ibfk_2` FOREIGN KEY (`construction_site_id`) REFERENCES `construction_site` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lubrication_sheet` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=948 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lubrication_sheet_spare_part` (
  `id` int NOT NULL AUTO_INCREMENT,
  `lubrication_sheet_id` int NOT NULL,
  `spare_part_id` int NOT NULL,
  `quantity` int DEFAULT NULL,
  `application` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `lubrication_sheet_id` (`lubrication_sheet_id`,`spare_part_id`,`application`),
  KEY `spare_part_id` (`spare_part_id`),
  CONSTRAINT `lubrication_sheet_spare_part_ibfk_1` FOREIGN KEY (`lubrication_sheet_id`) REFERENCES `lubrication_sheet` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `lubrication_sheet_spare_part_ibfk_2` FOREIGN KEY (`spare_part_id`) REFERENCES `spare_part` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=105 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `maintenance` (
  `id` int NOT NULL AUTO_INCREMENT,
  `equipment_id` int NOT NULL,
  `maintenance_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `maintenance_frequency_id` int NOT NULL,
  `equipment_partial_hours` int DEFAULT NULL,
  `equipment_total_hours` int DEFAULT NULL,
  `maintenance_cost` float DEFAULT NULL,
  `maintenance_duration` int DEFAULT NULL,
  `observations` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `maintenance_ibfk_1` (`equipment_id`),
  KEY `maintenance_ibfk_2` (`maintenance_frequency_id`),
  CONSTRAINT `maintenance_ibfk_1` FOREIGN KEY (`equipment_id`) REFERENCES `equipment` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `maintenance_ibfk_2` FOREIGN KEY (`maintenance_frequency_id`) REFERENCES `maintenance_frequency` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `maintenance_frequency` (
  `id` int NOT NULL AUTO_INCREMENT,
  `frequency` int NOT NULL,
  `lubrication_sheet_id` int NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `lubrication_sheet_id` (`lubrication_sheet_id`),
  CONSTRAINT `maintenance_frequency_ibfk_1` FOREIGN KEY (`lubrication_sheet_id`) REFERENCES `lubrication_sheet` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `maintenance_frequency_lubrication_sheet_spare_part` (
  `id` int NOT NULL AUTO_INCREMENT,
  `maintenance_frequency_id` int NOT NULL,
  `lubrication_sheet_spare_part_id` int NOT NULL,
  `replace` tinyint(1) DEFAULT '0',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `maintenance_frequency_id` (`maintenance_frequency_id`),
  KEY `lubrication_sheet_spare_part_id` (`lubrication_sheet_spare_part_id`),
  CONSTRAINT `maintenance_frequency_lubrication_sheet_spare_part_ibfk_1` FOREIGN KEY (`maintenance_frequency_id`) REFERENCES `maintenance_frequency` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `maintenance_frequency_lubrication_sheet_spare_part_ibfk_2` FOREIGN KEY (`lubrication_sheet_spare_part_id`) REFERENCES `lubrication_sheet_spare_part` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `maintenance_spare_part` (
  `id` int NOT NULL AUTO_INCREMENT,
  `maintenance_id` int NOT NULL,
  `spare_part_id` int NOT NULL,
  `quantity` int DEFAULT NULL,
  `application` varchar(255) DEFAULT NULL,
  `partial_cost` float DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `maintenance_id` (`maintenance_id`,`spare_part_id`,`application`),
  KEY `spare_part_id` (`spare_part_id`),
  CONSTRAINT `maintenance_spare_part_ibfk_1` FOREIGN KEY (`maintenance_id`) REFERENCES `maintenance` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `maintenance_spare_part_ibfk_2` FOREIGN KEY (`spare_part_id`) REFERENCES `spare_part` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `spare_part` (
  `id` int NOT NULL AUTO_INCREMENT,
  `internal_code` varchar(255) NOT NULL,
  `external_code` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `application` varchar(255) DEFAULT NULL,
  `brand` varchar(255) DEFAULT NULL,
  `model` varchar(255) DEFAULT NULL,
  `stock` int DEFAULT NULL,
  `unit_price` float DEFAULT NULL,
  `detail_link` varchar(255) DEFAULT NULL,
  `observations` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`internal_code`),
  UNIQUE KEY `external_code` (`external_code`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
