<?php
require "../security/userLoginSecurityCheck.php";
require_once "../common/db.php";
require "../common/checkFunctions/checkEntryExists.php";
require "../common/feedbackTemplate.php";
require "../security/validateInputs.php";

$input = validateInputs();
$output = $feedbackTemplate;

//TODO check overlapping date bookings (make a common function so bookings can use the same
//TODO check if status is expired or taken before changing
if (true === false) {
    $output["feedback"] = "The requested dates overlap with an existing booking";
    $output["title"] = "Booking already exists";
    $output["errorMessage"] = "Booking already exists";
    $output["errorType"] = "bookingExists";
} else {
    try {
        $editBooking = $db->prepare("UPDATE `bookings` SET `status` = 'requested', `dateFrom` = :from, `dateTo` = :to, `userComments` = :userComments, `editedBy` = :uid WHERE `id` = :id AND `organisationId` = :organisationId");
        $editBooking->bindValue(":organisationId", $_SESSION["user"]->organisationId);
        $editBooking->bindParam(":id", $input["id"]);
        $editBooking->bindParam(":from", $input["from"]);
        $editBooking->bindParam(":to", $input["to"]);
        $editBooking->bindParam(":userComments", $input["userComments"]);
        $editBooking->bindValue(":uid", $_SESSION["user"]->userId);
        $editBooking->execute();
        $output["success"] = true;
        $output["title"] = "Booking updated";
        $output["feedback"] = "A booking from " . $input["from"] . " to " . $input["to"] . " costing " . $input["hours"] . "hours was updated successfully";
    } catch (PDOException $e) {
        $output = array_merge($output, array("feedback" => "There was an error querying the database; please try again. If the error persists please contact a system administrator for assistance.", "errorMessage" => "There was an error querying the database; please try again. If the error persists please contact a system administrator for assistance.", "errorType" => "queryError"));
    }
}

echo json_encode($output);