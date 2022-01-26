<?php
require_once "../security/userLoginSecurityCheck.php";

function getAllowanceForUserByPeriod($period, $userId = null) {
    require "../common/db.php";
    $getAllowanceForUserIdByPeriodQuery = "
    SELECT
    IFNULL(`total`.`hours`, 0) AS `total`,
    IFNULL(`total`.`hours`, 0) AS `hours`,
    IFNULL(`b`.`booked`, 0) AS `booked`,
       IFNULL(`a`.`approved`, 0) AS `approved`,
       IFNULL(`r`.`requested`, 0) AS `requested`,
       IFNULL(`d`.`denied`, 0) AS `denied`,
       IFNULL(`t`.`taken`, 0) AS `taken`,
       IFNULL(`total`.`hours`, 0) - `booked` AS `remaining`
FROM (SELECT SUM(`hours`) AS `booked`
      FROM `bookings`
      WHERE `dateFrom` >= :dateFrom
        AND `dateTo` <= :dateTo
        AND `userId` = :userId
        AND `organisationId` = :organisationId
        AND `deleted` = 0) `b`
         CROSS JOIN (SELECT SUM(`hours`) AS `approved`
                     FROM `bookings`
                     WHERE `dateFrom` >= :dateFrom
                       AND `dateTo` <= :dateTo
                       AND `userId` = :userId
                       AND `status` = 'approved'
                       AND `organisationId` = :organisationId
                       AND `deleted` = 0) `a`
         CROSS JOIN (SELECT SUM(`hours`) AS `requested`
                     FROM `bookings`
                     WHERE `dateFrom` >= :dateFrom
                       AND `dateTo` <= :dateTo
                       AND `userId` = :userId
                       AND `status` = 'requested'
                       AND `organisationId` = :organisationId
                       AND `deleted` = 0) `r`
         CROSS JOIN (SELECT SUM(`hours`) AS `denied`
                     FROM `bookings`
                     WHERE `dateFrom` >= :dateFrom
                       AND `dateTo` <= :dateTo
                       AND `userId` = :userId
                       AND `status` = 'denied'
                       AND `organisationId` = :organisationId
                       AND `deleted` = 0) `d`
         CROSS JOIN (SELECT SUM(`hours`) AS `taken`
                     FROM `bookings`
                     WHERE `dateFrom` >= CURRENT_DATE
                       AND `dateTo` <= :dateTo
                       AND `userId` = :userId
                       AND `organisationId` = :organisationId
                       AND `deleted` = 0) `t`
         CROSS JOIN (SELECT `hours`
                     FROM `allowances`
                     WHERE `periodId` = :periodId
                       AND `userId` = :userId
                       AND `organisationId` = :organisationId
                       AND `deleted` = 0) `total`";
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
