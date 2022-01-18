<?php
require "../security/userLoginSecurityCheck.php";
require "../security/userAdminRightsCheck.php";
require_once "../common/db.php";
require "../common/checkFunctionExists.php";

require "../common/feedbackTemplate.php";

$input = json_decode(file_get_contents('php://input'), true);

$output = $feedbackTemplate;

    //TODO check overlapping date periods (make a common function so bookings can use the same
if (checkFunctionExists("periods", "id", array(array("key" => "name", "value" => $input["inputAddPeriodName"])))) {
    $output["feedback"] = "A period with that name already exists, please change the period name and try again";
    $output["title"] = "Period already exists";
    $output["errorMessage"] = "Period already exists";
    $output["errorType"] = "periodExists";
} else {
    try {
        $output["input"] = $input;
        $addPeriod = $db->prepare("INSERT INTO periods (organisationId, name, dateFrom, dateTo, createdBy, editedBy) VALUES (:organisationId,:name, :dateFrom, :dateTo, :uid1, :uid2)");
        $addPeriod->bindValue(":organisationId", $_SESSION["user"]->organisationId);
        $addPeriod->bindParam(":name", $input["inputAddPeriodName"]);
        $addPeriod->bindParam(":dateFrom", $input["inputAddPeriodFrom"]);
        $addPeriod->bindParam(":dateTo", $input["inputAddPeriodTo"]);
        $addPeriod->bindValue(":uid1", $_SESSION["user"]->userId);
        $addPeriod->bindValue(":uid2", $_SESSION["user"]->userId);
        $addPeriod->execute();
        $output["success"] = true;
        $output["title"] = "Period added";
        $output["feedback"] = $input["inputAddPeriodName"] . " was added successfully";
    } catch (PDOException $e) {
        $output = array_merge($output, array("feedback" => "There was an error querying the database; please try again. If the error persists please contact a system administrator for assistance.", "errorMessage" => "There was an error querying the database; please try again. If the error persists please contact a system administrator for assistance.", "errorType" => "queryError"));
    }
}

echo json_encode($output);