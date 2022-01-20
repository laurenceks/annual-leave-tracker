<?php
require "../security/userLoginSecurityCheck.php";
require_once "../common/db.php";
require "../common/checkFunctionExists.php";
require "../common/feedbackTemplate.php";

$input = json_decode(file_get_contents('php://input'), true);

$output = $feedbackTemplate;

if (!checkFunctionExists("bookings", "id", array(array("key" => "id", "value" => $input["id"])))) {
    $output["feedback"] = "The specified booking (" . $input["id"] . ") could not be found - possibly due to deletion - please try again";
    $output["title"] = "Missing booking";
    $output["errorMessage"] = "Booking ID " . $input["id"] . " could not be found";
    $output["errorType"] = "bookingMissing";
} else {
    try {
        $editBooking = $db->prepare("UPDATE `bookings` SET `status` = :status, `managerComments` = :managerComments, `editedBy` = :uid WHERE `id` = :id AND `organisationId` = :organisationId");
        $editBooking->bindValue(":organisationId", $_SESSION["user"]->organisationId);
        $editBooking->bindParam(":id", $input["id"]);
        $editBooking->bindParam(":status", $input["status"]);
        $editBooking->bindParam(":managerComments", $input["managerComments"]);
        $editBooking->bindValue(":uid", $_SESSION["user"]->userId);
        $editBooking->execute();

        $feedbackStringEnd = isset($input["feedbackVerb"]) ? $input["feedbackVerb"] : $input["status"];

        $output["success"] = true;
        $output["title"] = "Booking " . $feedbackStringEnd;
        $output["feedback"] = $input["userFullName"] . "'s booking was " . $feedbackStringEnd;
    } catch (PDOException $e) {
        $output = array_merge($output, array("feedback" => "There was an error querying the database; please try again. If the error persists please contact a system administrator for assistance.", "errorMessage" => $e->getMessage(), "errorType" => "queryError"));
    }
}

echo json_encode($output);