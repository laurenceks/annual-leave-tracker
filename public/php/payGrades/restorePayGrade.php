<?php
require "../security/userLoginSecurityCheck.php";
require "../security/userAdminRightsCheck.php";
require_once "../common/db.php";
require "../common/checkEntryExists.php";
require "../common/feedbackTemplate.php";

$input = json_decode(file_get_contents('php://input'), true);

$output = $feedbackTemplate;

if (!checkFunctionExists("pay_grades", "id", array(array("key" => "id", "value" => $input["id"])), true)) {
    $output["feedback"] = $input["name"] . " could not be found - possibly due to deletion - please try again";
    $output["title"] = "Missing pay grade";
    $output["errorMessage"] = $input["name"] . " could not be found";
    $output["errorType"] = "payGradeMissing";
} else {
    try {
        $restorePayGrade = $db->prepare("UPDATE pay_grades SET deleted = 0, editedBy = :uid WHERE id = :id AND organisationId = :organisationId");
        $restorePayGrade->bindValue(":organisationId", $_SESSION["user"]->organisationId);
        $restorePayGrade->bindParam(":id", $input["id"]);
        $restorePayGrade->bindValue(":uid", $_SESSION["user"]->userId);
        $restorePayGrade->execute();
        $output["success"] = true;
        $output["title"] = "Pay grade restored";
        $output["feedback"] = $input["name"] . " was restored successfully";
    } catch (PDOException $e) {
        $output = array_merge($output, array("feedback" => "There was an error querying the database; please try again. If the error persists please contact a system administrator for assistance.", "errorMessage" => "There was an error querying the database; please try again. If the error persists please contact a system administrator for assistance.", "errorType" => "queryError"));
    }
}

echo json_encode($output);