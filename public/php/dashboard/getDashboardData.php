<?php
require "../security/userLoginSecurityCheck.php";
require "../common/db.php";
require "../common/feedbackTemplate.php";

$output = array_merge($feedbackTemplate, array("bookings" => array()));
$input = json_decode(file_get_contents('php://input'), true);

if (!$input["periodId"]) {
    try {
        $getPeriodId = $db->prepare("SELECT `id`, `name`, `dateFrom`, `dateTo` FROM `periods` WHERE `dateFrom` <= CURRENT_DATE AND `dateTo` >= CURRENT_DATE AND `deleted` = 0 AND `organisationId` = :organisationId");
        $getPeriodId->bindValue(':organisationId', $_SESSION["user"]->organisationId);
        $getPeriodId->execute();
        $getPeriodId = $getPeriodId->fetch(PDO::FETCH_ASSOC);
        $period = $getPeriodId;
        $period["defaultedToCurrent"] = true;
        $output["period"] = $period;
    } catch (PDOException $e) {
        $period = null;
    }
} else {
    $period = $input["period"];
}

if (isset($period["id"])) {
    require "dashboardChartMonthQuery.php";
    require "../allocations/getAllocationForCurrentUserByPeriod.php";

    $getChartMonths = $db->prepare($dashboardChartMonthQuery);

    $getChartMonths->bindValue(':userId', $_SESSION["user"]->userId);
    $getChartMonths->bindValue(':organisationId', $_SESSION["user"]->organisationId);
    $getChartMonths->bindValue(':dateFrom', $period["dateFrom"]);
    $getChartMonths->bindValue(':dateTo', $period["dateTo"]);
    $getChartMonths->execute();

    $output["chartData"]["chartMonths"] = $getChartMonths->fetchAll(PDO::FETCH_ASSOC);

    $db->setAttribute(PDO::ATTR_EMULATE_PREPARES, true);
    $getAllocationForUserIdByPeriod = $db->prepare($getAllocationForUserIdByPeriodQuery);
    $getAllocationForUserIdByPeriod->bindValue(':userId', $_SESSION["user"]->userId);
    $getAllocationForUserIdByPeriod->bindValue(':organisationId', $_SESSION["user"]->organisationId);
    $getAllocationForUserIdByPeriod->bindValue(':dateFrom', $period["dateFrom"]);
    $getAllocationForUserIdByPeriod->bindValue(':dateTo', $period["dateTo"]);
    $getAllocationForUserIdByPeriod->bindValue(':periodId', $period["id"]);
    $db->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
    $getAllocationForUserIdByPeriod->execute();

    $output["period"] = $period;

    $allocationForIdAndPeriod = $getAllocationForUserIdByPeriod->fetch(PDO::FETCH_ASSOC);;
    $output["allocation"] = $allocationForIdAndPeriod;

    $output["chartData"]["chartHours"] = array(array("label" => "Total", "hours" => isset($allocationForIdAndPeriod["total"]) ? $allocationForIdAndPeriod["total"] : 0), array("label" => "Booked", "hours" => $allocationForIdAndPeriod["booked"]), array("label" => "Taken", "hours" => $allocationForIdAndPeriod["taken"]), array("label" => "Remaining", "hours" => isset($allocationForIdAndPeriod["hours"]) ? $allocationForIdAndPeriod["total"] - $allocationForIdAndPeriod["booked"] : 0));

    $getBookings = $db->prepare("SELECT * FROM `bookings` WHERE `dateFrom` >= :dateFrom AND `dateTo` <= :dateTo AND `userId` = :userId AND `organisationId`= :organisationId AND `deleted` = 0");
    $getBookings->bindValue(':userId', $_SESSION["user"]->userId);
    $getBookings->bindValue(':organisationId', $_SESSION["user"]->organisationId);
    $getBookings->bindValue(':dateFrom', $period["dateFrom"]);
    $getBookings->bindValue(':dateTo', $period["dateTo"]);
    $getBookings->execute();

    $output["bookings"] = $getBookings->fetchAll(PDO::FETCH_ASSOC);


} else {
    $output["noPeriod"] = true;
}

$output["success"] = true;
$output["title"] = "Data updated";
$output["feedback"] = isset($period["id"]) ? "Now showing data for the period " . $period["name"] : "No matching period could be found";

echo json_encode($output, JSON_NUMERIC_CHECK);
