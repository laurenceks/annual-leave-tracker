<?php
require "../security/userLoginSecurityCheck.php";
require "../common/db.php";
require "../common/feedbackTemplate.php";

$output = array_merge($feedbackTemplate, array("bookings" => array()));
$input = json_decode(file_get_contents('php://input'), true);

$getPeriodId = $db->prepare("SELECT `id`, `name`, `dateFrom`, `dateTo` FROM `periods` WHERE `dateFrom` <= CURRENT_DATE AND `dateTo` >= CURRENT_DATE AND `deleted` = 0");
$getPeriodId->execute();
$getPeriodId = $getPeriodId->fetch(PDO::FETCH_ASSOC);
$period = $getPeriodId ? $getPeriodId : null;
$output["period"] = $period;

if ($period) {
    require "dashboardChartMonthQuery.php";
    require "../allocations/getAllocationForCurrentUserQuery.php";

    $getChartMonths = $db->prepare($dashboardChartMonthQuery);

    $getChartMonths->bindValue(':userId', $_SESSION["user"]->userId);
    $getChartMonths->bindValue(':organisationId', $_SESSION["user"]->organisationId);
    $getChartMonths->bindValue(':dateFrom', $period["dateFrom"]);
    $getChartMonths->bindValue(':dateTo', $period["dateTo"]);
    $getChartMonths->execute();

    $output["chartData"]["chartMonths"] = $getChartMonths->fetchAll(PDO::FETCH_ASSOC);

    $db->setAttribute(PDO::ATTR_EMULATE_PREPARES, true);
    $getAllocations = $db->prepare($getAllocationForCurrentUserQuery);

    $getAllocations->bindValue(':userId', $_SESSION["user"]->userId);
    $getAllocations->bindValue(':organisationId', $_SESSION["user"]->organisationId);
    $getAllocations->bindValue(':dateFrom', $period["dateFrom"]);
    $getAllocations->bindValue(':dateTo', $period["dateTo"]);
    $db->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
    $getAllocations->execute();

    $output["allocation"] = $getAllocations->fetch(PDO::FETCH_ASSOC);;

    $output["chartData"]["chartHours"] = array(array("label" => "Total", "hours" => 350), array("label" => "Booked", "hours" => 125), array("label" => "Taken", "hours" => 86), array("label" => "Remaining", "hours" => 225));

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
$output["feedback"] = $period ? "Now showing data for the period " . $period["name"] : "No matching period could be found";

echo json_encode($output, JSON_NUMERIC_CHECK);
