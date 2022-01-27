<?php
require "../security/userLoginSecurityCheck.php";
require "../common/db.php";
require "../common/feedbackTemplate.php";

$output = array_merge($feedbackTemplate, array("bookings" => array()));
$input = json_decode(file_get_contents('php://input'), true);

if (!$input["periodId"]) {
    require "../periods/getPeriodIdFromDateRange.php";
    $period = getPeriodIdFromDateRange();
} else {
    $period = $input["period"];
}

if (isset($period["id"])) {
    require "dashboardChartMonthQuery.php";
    require "../allowances/getAllowanceForUserByPeriod.php";

    $getChartMonths = $db->prepare($dashboardChartMonthQuery);

    $getChartMonths->bindValue(':userId', $_SESSION["user"]->userId);
    $getChartMonths->bindValue(':organisationId', $_SESSION["user"]->organisationId);
    $getChartMonths->bindValue(':dateFrom', $period["dateFrom"]);
    $getChartMonths->bindValue(':dateTo', $period["dateTo"]);
    $getChartMonths->execute();

    $output["chartData"]["chartMonths"] = $getChartMonths->fetchAll(PDO::FETCH_ASSOC);


    $output["period"] = $period;

    $allowanceForIdAndPeriod = getAllowanceForUserByPeriod($period);
    $output["allowance"] = $allowanceForIdAndPeriod;

    $output["chartData"]["chartHours"] = [["label" => "Remaining", "hours" => isset($allowanceForIdAndPeriod["remaining"]) ? $allowanceForIdAndPeriod["remaining"] : 0],["label" => "Requested", "hours" => $allowanceForIdAndPeriod["requested"]], ["label" => "Taken", "hours" => $allowanceForIdAndPeriod["taken"]]];

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
