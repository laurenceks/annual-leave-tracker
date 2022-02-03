<?php
require "../security/userLoginSecurityCheck.php";
require "../security/userAdminRightsCheck.php";
require_once "../common/db.php";
require "../common/checkFunctions/checkEntryExists.php";
require "../common/feedbackTemplate.php";
require "../security/validateInputs.php";

$input = validateInputs();
$output = $feedbackTemplate;

if (!checkEntryExists("periods", "id", array(array("key" => "id", "value" => $input["id"])), true)) {
    $output["feedback"] = $input["name"] . " could not be found - possibly due to deletion - please try again";
    $output["title"] = "Missing period";
    $output["errorMessage"] = $input["name"] . " could not be found";
    $output["errorType"] = "periodMissing";
} else {
    try {
        $deletePeriod = $db->prepare("UPDATE periods SET deleted = 0, editedBy = :uid WHERE id = :id AND organisationId = :organisationId");
        $deletePeriod->bindValue(":organisationId", $_SESSION["user"]->organisationId);
        $deletePeriod->bindParam(":id", $input["id"]);
        $deletePeriod->bindValue(":uid", $_SESSION["user"]->userId);
        $deletePeriod->execute();
        $output["success"] = true;
        $output["title"] = "Period restored";
        $output["feedback"] = $input["name"] . " was restored successfully";
    } catch (PDOException $e) {
        $output = array_merge($output, array("feedback" => "There was an error querying the database; please try again. If the error persists please contact a system administrator for assistance.", "errorMessage" => "There was an error querying the database; please try again. If the error persists please contact a system administrator for assistance.", "errorType" => "queryError"));
    }
}

echo json_encode($output);