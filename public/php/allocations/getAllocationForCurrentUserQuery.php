<?php
$getAllocationForCurrentUserQuery = "
SELECT
users.id,
allocations.hours as total,
IFNULL((SELECT SUM(`hours`) FROM `bookings` WHERE `dateFrom` >= :dateFrom AND dateTo <= :dateTo AND `userId` = :userId AND `organisationId` = :organisationId AND `deleted` = 0), 0) AS `booked`,
IFNULL((SELECT SUM(`hours`) FROM `bookings` WHERE `dateFrom` >= :dateFrom AND `dateTo` <= :dateTo AND `status` = 'approved' AND `userId` = :userId AND `organisationId` = :organisationId AND `deleted` = 0), 0) AS `approved`,
IFNULL((SELECT SUM(`hours`) FROM `bookings` WHERE `dateFrom` >= :dateFrom AND `dateTo` <= :dateTo AND `status` = 'requested' AND `userId` = :userId AND `organisationId` = :organisationId AND `deleted` = 0), 0) AS `requested`,
IFNULL((SELECT SUM(`hours`) FROM `bookings` WHERE `dateFrom` >= :dateFrom AND `dateTo` <= :dateTo AND `status` = 'denied' AND `userId` = :userId AND `organisationId` = :organisationId AND `deleted` = 0), 0) AS `denied`,
IFNULL((SELECT SUM(`hours`) FROM `bookings` WHERE `dateFrom` >= :dateFrom AND `dateTo` <= :dateTo AND `status` = 'approved' AND `userId` = :userId AND `organisationId` = :organisationId AND `deleted` = 0 AND `dateFrom` <= CURRENT_DATE()), 0) AS `taken`
FROM users LEFT JOIN allocations ON users.id = allocations.userId LEFT JOIN bookings on users.id = bookings.userId
        WHERE users.id = :userId
GROUP BY users.id;";