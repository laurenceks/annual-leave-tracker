<?php
require "../security/userLoginSecurityCheck.php";
require "../security/userAdminRightsCheck.php";
require_once "../common/db.php";
require "../common/checkFunctions/checkEntryExists.php";
require "../common/feedbackTemplate.php";

require "../security/validateInputs.php";

$input = validateInputs();
$output = $feedbackTemplate;

if (checkEntryExists("locations", "id", array(array("key" => "name", "value" => $input["inputAddLocationName"])))) {
    $output["feedback"] = "A location with that name already exists, please change the location name and try again";
    $output["title"] = "Location already exists";
    $output["errorMessage"] = "Location already exists";
    $output["errorType"] = "locationExists";
} else {
    try {
        $addLocation = $db->prepare("INSERT INTO locations (organisationId, name, createdBy, editedBy) VALUES (:organisationId,:name, :uid1, :uid2)");
        $addLocation->bindValue(":organisationId", $_SESSION["user"]->organisationId);
        $addLocation->bindParam(":name", $input["inputAddLocationName"]);
        $addLocation->bindValue(":uid1", $_SESSION["user"]->userId);
        $addLocation->bindValue(":uid2", $_SESSION["user"]->userId);
        $addLocation->execute();
        $output["success"] = true;
        $output["title"] = "Location added";
        $output["feedback"] = $input["inputAddLocationName"] . " was added successfully";
    } catch (PDOException $e) {
        $output = array_merge($output, array("feedback" => "There was an error querying the database; please try again. If the error persists please contact a system administrator for assistance.", "errorMessage" => "There was an error querying the database; please try again. If the error persists please contact a system administrator for assistance.", "errorType" => "queryError"));
    }
}

echo json_encode($output);