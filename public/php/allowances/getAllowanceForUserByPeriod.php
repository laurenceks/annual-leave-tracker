<?php
require_once "../security/userLoginSecurityCheck.php";

function getAllowanceForUserByPeriod($period, $userId = null) {
    require "../common/db.php";
    $getAllowanceForUserIdByPeriodQuery = "SELECT (SELECT `hours`
            FROM `allowances`
            WHERE `allowances`.`periodId` = `periods`.`id`
              AND `allowances`.`userId` = :userId) AS `total`,
           IFNULL((SELECT SUM(`hours`)
                   FROM `bookings`
                   WHERE `dateFrom` >= :dateFrom
                     AND `dateTo` <= :dateTo
                     AND `userId` = :userId
                     AND `organisationId` = :organisationId
                     AND `deleted` = 0), 0) AS `booked`,
           IFNULL((SELECT SUM(`hours`)
                   FROM `bookings`
                   WHERE `dateFrom` >= :dateFrom
                     AND `dateTo` <= :dateTo
                     AND `status` = 'approved'
                     AND `userId` = :userId
                     AND `organisationId` = :organisationId
                     AND `deleted` = 0), 0) AS `approved`,
           IFNULL((SELECT SUM(`hours`)
                   FROM `bookings`
                   WHERE `dateFrom` >= :dateFrom
                     AND `dateTo` <= :dateTo
                     AND `status` = 'requested'
                     AND `userId` = :userId
                     AND `organisationId` = :organisationId
                     AND `deleted` = 0), 0) AS `requested`,
           IFNULL((SELECT SUM(`hours`)
                   FROM `bookings`
                   WHERE `dateFrom` >= :dateFrom
                     AND `dateTo` <= :dateTo
                     AND `status` = 'denied'
                     AND `userId` = :userId
                     AND `organisationId` = :organisationId
                     AND `deleted` = 0), 0) AS `denied`,
           IFNULL((SELECT SUM(`hours`)
                   FROM `bookings`
                   WHERE `dateFrom` >= :dateFrom
                     AND `dateTo` <= :dateTo
                     AND `status` = 'approved'
                     AND `userId` = :userId
                     AND `organisationId` = :organisationId
                     AND `deleted` = 0
                     AND `dateFrom` <= CURRENT_DATE()), 0) AS `taken`
    FROM `periods`
    WHERE `periods`.`id` = :periodId";
    $db->setAttribute(PDO::ATTR_EMULATE_PREPARES, true);
    $getAllowanceForUserIdByPeriod = $db->prepare($getAllowanceForUserIdByPeriodQuery);
    $getAllowanceForUserIdByPeriod->bindValue(':userId', $userId ?: $_SESSION["user"]->userId);
    $getAllowanceForUserIdByPeriod->bindValue(':organisationId', $_SESSION["user"]->organisationId);
    $getAllowanceForUserIdByPeriod->bindValue(':dateFrom', $period["dateFrom"]);
    $getAllowanceForUserIdByPeriod->bindValue(':dateTo', $period["dateTo"]);
    $getAllowanceForUserIdByPeriod->bindValue(':periodId', $period["id"]);
    $db->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
    $getAllowanceForUserIdByPeriod->execute();

    return $getAllowanceForUserIdByPeriod->fetch(PDO::FETCH_ASSOC);
}
