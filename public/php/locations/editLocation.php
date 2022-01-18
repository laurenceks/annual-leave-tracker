<?php
require "../security/userLoginSecurityCheck.php";
require "../security/userAdminRightsCheck.php";
require_once "../common/db.php";
require "../common/checkFunctionExists.php";
require "../common/feedbackTemplate.php";

$input = json_decode(file_get_contents('php://input'), true);

$output = $feedbackTemplate;

if (!checkFunctionExists("locations", "id", array(array("key" => "id", "value" => $input["id"])))) {
    $output["feedback"] = $input["name"] . " could not be found - possibly due to deletion - please try again";
    $output["title"] = "Missing location";
    $output["errorMessage"] = $input["name"] . " could not be found";
    $output["errorType"] = "locationMissing";
} else if (checkFunctionExists("locations", "name", array(array("key" => "name", "value" => $input["name"])), false, true, $input["id"])) {
    $output["feedback"] = "A location with that name already exists, please change the location name and try again";
    $output["title"] = "Location already exists";
    $output["errorMessage"] = "Location already exists";
    $output["errorType"] = "locationExists";
} else {
    try {
        $editLocation = $db->prepare("UPDATE locations SET name = :name, editedBy = :uid WHERE id = :id AND organisationId = :organisationId");
        $editLocation->bindValue(":organisationId", $_SESSION["user"]->organisationId);
        $editLocation->bindParam(":name", $input["name"]);
        $editLocation->bindParam(":id", $input["id"]);
        $editLocation->bindValue(":uid", $_SESSION["user"]->userId);
        $editLocation->execute();
        $output["success"] = true;
        $output["title"] = "Location updated";
        $output["feedback"] = $input["name"] . " was updated successfully";
    } catch (PDOException $e) {
        $output = array_merge($output, array("feedback" => "There was an error querying the database; please try again. If the error persists please contact a system administrator for assistance.", "errorMessage" => "There was an error querying the database; please try again. If the error persists please contact a system administrator for assistance.", "errorType" => "queryError"));
    }
}

echo json_encode($output);