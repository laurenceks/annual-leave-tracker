<?php
require "../security/userLoginSecurityCheck.php";
require "../common/db.php";
require "../common/feedbackTemplate.php";
require "bookingsByDateQuery.php";
require "../periods/getPeriodIdFromDateRange.php";
require "../allowances/getAllowanceForUserByPeriod.php";

$output = array_merge($feedbackTemplate, array("bookings" => array()));
$input = json_decode(file_get_contents('php://input'), true);
$getBookingsByDate = $db->prepare($bookingsByDateQuery);

$getBookingsByDate->bindValue(':organisationId', $_SESSION["user"]->organisationId);
$getBookingsByDate->bindValue(':locationId', $_SESSION["user"]->locationId);
$getBookingsByDate->bindValue(':payGradeId', $_SESSION["user"]->payGradeId);
$getBookingsByDate->bindValue(':dateFrom', $input["dateFrom"]);
$getBookingsByDate->bindValue(':dateTo', $input["dateTo"]);
$getBookingsByDate->execute();

$period = getPeriodIdFromDateRange($input["dateFrom"], $input["dateTo"]);

//get all

$output["bookings"] = $getBookingsByDate->fetchAll(PDO::FETCH_ASSOC);
$output["success"] = true;
$output["title"] = "Bookings updated";
$output["feedback"] = "Bookings data has been refreshed";

echo json_encode($output);
