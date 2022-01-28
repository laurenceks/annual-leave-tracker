<?php
require "../security/userLoginSecurityCheck.php";
require "../security/userAdminRightsCheck.php";
require_once "../common/db.php";
require "../common/checkFunctions/checkEntryExists.php";
require "../common/feedbackTemplate.php";

$input = json_decode(file_get_contents('php://input'), true);

$output = $feedbackTemplate;

if (!checkEntryExists("users_info", "id", array(array("key" => "userId", "value" => $input["id"])), true)) {
    $output["feedback"] = $input["staffFullName"] . " could not be found - possibly due to deletion - please try again";
    $output["title"] = "Missing staff";
    $output["errorMessage"] = $input["staffFullName"] . " could not be found";
    $output["errorType"] = "staffMissing";
} else {
    try {
        $editLocation = $db->prepare("UPDATE `users_info`
SET `locationId` = :locationId,
    `payGradeId` = :payGradeId,
    `editedBy`   = :uid
WHERE `userId` = :id
  AND `organisationId` = :organisationId");
        $editLocation->bindValue(":organisationId", $_SESSION["user"]->organisationId);
        $editLocation->bindParam(":locationId", $input["locationId"]);
        $editLocation->bindParam(":payGradeId", $input["payGradeId"]);
        $editLocation->bindParam(":id", $input["id"]);
        $editLocation->bindValue(":uid", $_SESSION["user"]->userId);
        $editLocation->execute();
        $output["success"] = true;
        $output["title"] = "Location updated";
        $output["feedback"] = $input["staffFullName"] . " was updated successfully";
    } catch (PDOException $e) {
        $output = array_merge($output, array("feedback" => "There was an error querying the database; please try again. If the error persists please contact a system administrator for assistance.", "errorMessage" => "There was an error querying the database; please try again. If the error persists please contact a system administrator for assistance.", "errorType" => "queryError"));
    }
}

echo json_encode($output);