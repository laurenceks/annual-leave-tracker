<?php
require "../security/userLoginSecurityCheck.php";
require "../security/userAdminRightsCheck.php";
require_once "../common/db.php";
require "../common/checkFunctionExists.php";
require "../common/feedbackTemplate.php";

$input = json_decode(file_get_contents('php://input'), true);

$output = $feedbackTemplate;

if (!checkFunctionExists("bookings", "id", array(array("key" => "id", "value" => $input["id"])), true)) {
    $output["feedback"] = $input["name"] . " could not be found - possibly due to deletion - please try again";
    $output["title"] = "Missing booking";
    $output["errorMessage"] = $input["name"] . " could not be found";
    $output["errorType"] = "bookingMissing";
} else {
    try {
        $deleteBooking = $db->prepare("UPDATE bookings SET deleted = 0, editedBy = :uid WHERE id = :id AND organisationId = :organisationId");
        $deleteBooking->bindValue(":organisationId", $_SESSION["user"]->organisationId);
        $deleteBooking->bindParam(":id", $input["id"]);
        $deleteBooking->bindValue(":uid", $_SESSION["user"]->userId);
        $deleteBooking->execute();
        $output["success"] = true;
        $output["title"] = "Booking restored";
        $output["feedback"] = "A booking from " . $input["name"] . " was restored successfully";
    } catch (PDOException $e) {
        $output = array_merge($output, array("feedback" => "There was an error querying the database; please try again. If the error persists please contact a system administrator for assistance.", "errorMessage" => "There was an error querying the database; please try again. If the error persists please contact a system administrator for assistance.", "errorType" => "queryError"));
    }
}

echo json_encode($output);