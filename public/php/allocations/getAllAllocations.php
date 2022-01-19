<?php
require "../security/userLoginSecurityCheck.php";
require "../common/db.php";
require "../common/feedbackTemplate.php";

$output = array_merge($feedbackTemplate, array("bookings" => array()));
$input = json_decode(file_get_contents('php://input'), true);
$getAllBookings = $db->prepare("
SELECT 
  *
FROM 
  bookings 
WHERE 
  bookings.organisationId = :organisationId;");

$getAllBookings->bindValue(':organisationId', $_SESSION["user"]->organisationId);
$getAllBookings->execute();
$output["bookings"] = $getAllBookings->fetchAll(PDO::FETCH_ASSOC);
$output["success"] = true;
$output["title"] = "Bookings updated";
$output["feedback"] = "Bookings data has been refreshed";

echo json_encode($output);
