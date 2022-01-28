<?php
require "../security/userLoginSecurityCheck.php";
require_once "../common/db.php";
require "../common/checkFunctions/checkDatesOverlap.php";

require "../common/feedbackTemplate.php";

$input = json_decode(file_get_contents('php://input'), true);

$output = $feedbackTemplate;

if (checkDatesOverlap("bookings", $input["inputAddBookingFrom"], $input["inputAddBookingFrom"], true, $_SESSION["user"]->userId)) {
    $output["feedback"] = "The requested dates overlap with an existing booking";
    $output["title"] = "Booking already exists";
    $output["errorMessage"] = "Booking already exists";
    $output["errorType"] = "bookingExists";
} else {
    try {
        $output["input"] = $input;
        $addBooking = $db->prepare("INSERT INTO bookings (organisationId, userId, dateFrom, dateTo, hours, userComments, createdBy, editedBy) VALUES (:organisationId, :uid1, :dateFrom, :dateTo, :hours, :userComments, :uid2, :uid3)");
        $addBooking->bindValue(":organisationId", $_SESSION["user"]->organisationId);
        $addBooking->bindParam(":hours", $input["inputAddBookingHours"]);
        $addBooking->bindParam(":userComments", $input["inputAddBookingUserComments"]);
        $addBooking->bindParam(":dateFrom", $input["inputAddBookingFrom"]);
        $addBooking->bindParam(":dateTo", $input["inputAddBookingTo"]);
        $addBooking->bindValue(":uid1", $_SESSION["user"]->userId);
        $addBooking->bindValue(":uid2", $_SESSION["user"]->userId);
        $addBooking->bindValue(":uid3", $_SESSION["user"]->userId);
        $addBooking->execute();
        $output["success"] = true;
        $output["title"] = "Booking added";
        $output["feedback"] = "A booking from " . $input["inputAddBookingFrom"] . " to " . $input["inputAddBookingTo"] . " costing " . $input["inputAddBookingHours"] . " hours was added successfully";
    } catch (PDOException $e) {
        $output = array_merge($output, array("feedback" => "There was an error querying the database; please try again. If the error persists please contact a system administrator for assistance.", "errorMessage" => "There was an error querying the database; please try again. If the error persists please contact a system administrator for assistance.", "errorType" => "queryError"));
    }
}

echo json_encode($output);