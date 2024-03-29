<?php
require "../security/userLoginSecurityCheck.php";
require_once "../common/db.php";
require "../common/checkFunctions/checkEntryExists.php";
require "../common/feedbackTemplate.php";
require "../security/validateInputs.php";

$input = validateInputs();
$output = $feedbackTemplate;

if (!checkEntryExists("bookings", "id", array(array("key" => "id", "value" => $input["id"])))) {
    $output["feedback"] = $input["name"] . " could not be found - possibly due to deletion - please try again";
    $output["title"] = "Missing booking";
    $output["errorMessage"] = $input["name"] . " could not be found";
    $output["errorType"] = "bookingMissing";
} else {
    try {
        $deleteBooking = $db->prepare("UPDATE bookings SET deleted = 1, editedBy = :uid WHERE id = :id AND organisationId = :organisationId");
        $deleteBooking->bindValue(":organisationId", $_SESSION["user"]->organisationId);
        $deleteBooking->bindParam(":id", $input["id"]);
        $deleteBooking->bindValue(":uid", $_SESSION["user"]->userId);
        $deleteBooking->execute();
        $output["success"] = true;
        $output["title"] = "Booking deleted";
        $output["feedback"] = "A booking from " . $input["name"] . " was deleted successfully";
    } catch (PDOException $e) {
        $output = array_merge($output, array("feedback" => "There was an error querying the database; please try again. If the error persists please contact a system administrator for assistance.", "errorMessage" => "There was an error querying the database; please try again. If the error persists please contact a system administrator for assistance.", "errorType" => "queryError"));
    }
}

echo json_encode($output);