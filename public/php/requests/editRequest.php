<?php
require "../security/userLoginSecurityCheck.php";
require_once "../common/db.php";
require "../common/checkFunctions/checkEntryExists.php";
require "../common/feedbackTemplate.php";

$input = json_decode(file_get_contents('php://input'), true);

$output = $feedbackTemplate;

if (!checkEntryExists("bookings", "id", array(array("key" => "id", "value" => $input["id"])))) {
    $output["feedback"] = "The specified booking (" . $input["id"] . ") could not be found - possibly due to deletion - please try again";
    $output["title"] = "Missing booking";
    $output["errorMessage"] = "Booking ID " . $input["id"] . " could not be found";
    $output["errorType"] = "bookingMissing";
} else {
    try {
        $editBooking = $db->prepare("UPDATE `bookings`
SET `status` = :status,
    `managerCommentsId` = IF((`bookings`.`managerComments` != :managerComments1) OR
                             (`bookings`.`managerComments` IS NULL AND :managerComments2 IS NOT NULL) OR
                             (`bookings`.`managerComments` IS NOT NULL AND :managerComments3 IS NULL), :uid1,
                             `bookings`.`managerCommentsId`),
    `managerComments` = :managerComments4,
    `editedBy` = :uid2
WHERE `id` = :id
  AND `organisationId` = :organisationId");
        $editBooking->bindValue(":organisationId", $_SESSION["user"]->organisationId);
        $editBooking->bindParam(":id", $input["id"]);
        $editBooking->bindParam(":status", $input["status"]);
        $editBooking->bindValue(":managerComments1", $input["managerComments"]);
        $editBooking->bindValue(":managerComments2", $input["managerComments"]);
        $editBooking->bindValue(":managerComments3", $input["managerComments"]);
        $editBooking->bindValue(":uid1", $_SESSION["user"]->userId);
        $editBooking->bindValue(":uid2", $_SESSION["user"]->userId);
        $editBooking->execute();

        $feedbackStringEnd = isset($input["feedbackVerb"]) ? $input["feedbackVerb"] : $input["status"];

        $output["success"] = true;
        $output["title"] = "Booking " . $feedbackStringEnd;
        $output["feedback"] = $input["userFullName"] . "'s booking was " . $feedbackStringEnd;
    } catch (PDOException $e) {
        $output = array_merge($output, array("feedback" => "There was an error querying the database; please try again. If the error persists please contact a system administrator for assistance.", "errorMessage" => "There was an error querying the database; please try again. If the error persists please contact a system administrator for assistance.", "errorType" => "queryError"));
    }
}

echo json_encode($output);