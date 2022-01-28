<?php
require "../security/userLoginSecurityCheck.php";
require "../security/userAdminRightsCheck.php";
require_once "../common/db.php";
require "../common/checkEntryExists.php";
require "../common/feedbackTemplate.php";

$input = json_decode(file_get_contents('php://input'), true);

$output = $feedbackTemplate;
//TODO check overlapping date bookings (make a common function so bookings can use the same

if (!checkEntryExists("periods", "id", array(array("key" => "id", "value" => $input["id"])))) {
    $output["feedback"] = $input["name"] . " could not be found - possibly due to deletion - please try again";
    $output["title"] = "Missing period";
    $output["errorMessage"] = $input["name"] . " could not be found";
    $output["errorType"] = "periodMissing";
} else if (checkEntryExists("periods", "name", array(array("key" => "name", "value" => $input["name"])), false, true, $input["id"])) {
    $output["feedback"] = "A period with that name already exists, please change the period name and try again";
    $output["title"] = "Period already exists";
    $output["errorMessage"] = "Period already exists";
    $output["errorType"] = "periodExists";
} else {
    try {
        $editPeriod = $db->prepare("UPDATE `periods` SET `name` = :name, `dateFrom` = :from, `dateTo` = :to, `editedBy` = :uid WHERE `id` = :id AND `organisationId` = :organisationId");
        $editPeriod->bindValue(":organisationId", $_SESSION["user"]->organisationId);
        $editPeriod->bindParam(":name", $input["name"]);
        $editPeriod->bindParam(":id", $input["id"]);
        $editPeriod->bindParam(":from", $input["from"]);
        $editPeriod->bindParam(":to", $input["to"]);
        $editPeriod->bindValue(":uid", $_SESSION["user"]->userId);
        $editPeriod->execute();
        $output["success"] = true;
        $output["title"] = "Period updated";
        $output["feedback"] = $input["name"] . " was updated successfully";
    } catch (PDOException $e) {
        $output = array_merge($output, array("feedback" => "There was an error querying the database; please try again. If the error persists please contact a system administrator for assistance.", "errorMessage" => "There was an error querying the database; please try again. If the error persists please contact a system administrator for assistance.", "errorType" => "queryError"));
    }
}

echo json_encode($output);