<?php
//require_once "../security/userLoginSecurityCheck.php";
getPeriodIdFromDateRange();
function getPeriodIdFromDateRange($dateFrom = null, $dateTo = null) {
    require "../common/db.php";
    $dateFrom = $dateFrom ?: date("Y-m-d");
    $dateTo = $dateTo ?: $dateFrom;

    try {
        $getPeriodId = $db->prepare("
SELECT `id`, `name`, `dateFrom`, `dateTo`
FROM `periods`
WHERE `dateFrom` <= :dateFrom 
  AND `dateTo` >= :dateTo 
  AND `deleted` = 0
  AND `organisationId` = :organisationId");
        $getPeriodId->bindValue(':organisationId', $_SESSION["user"]->organisationId);
        $getPeriodId->bindValue(':dateFrom', $dateFrom);
        $getPeriodId->bindValue(':dateTo', $dateTo);
        $getPeriodId->execute();
        $getPeriodId = $getPeriodId->fetch(PDO::FETCH_ASSOC);
        $period = $getPeriodId;
        $period["defaultedToCurrent"] = true;
    } catch (PDOException $e) {
        //error - nothing to do as period is already null
    }
    return $period;
}