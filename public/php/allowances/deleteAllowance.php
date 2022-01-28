<?php
require "../security/userLoginSecurityCheck.php";
require "../security/userAdminRightsCheck.php";
require_once "../common/db.php";
require "../common/checkEntryExists.php";
require "../common/feedbackTemplate.php";

$input = json_decode(file_get_contents('php://input'), true);

$output = $feedbackTemplate;

if (!checkEntryExists("allowances", "id", array(array("key" => "id", "value" => $input["id"])))) {
    $output["feedback"] = $input["name"] . " could not be found - possibly due to deletion - please try again";
    $output["title"] = "Missing allowance";
    $output["errorMessage"] = $input["name"] . " could not be found";
    $output["errorType"] = "allowanceMissing";
} else {
    try {
        $deleteAllowance = $db->prepare("UPDATE allowances SET deleted = 1, editedBy = :uid WHERE id = :id AND organisationId = :organisationId");
        $deleteAllowance->bindValue(":organisationId", $_SESSION["user"]->organisationId);
        $deleteAllowance->bindParam(":id", $input["id"]);
        $deleteAllowance->bindValue(":uid", $_SESSION["user"]->userId);
        $deleteAllowance->execute();
        $output["success"] = true;
        $output["title"] = "Allowance deleted";
        $output["feedback"] = $input["name"] . " was deleted successfully";
    } catch (PDOException $e) {
        $output = array_merge($output, array("feedback" => "There was an error querying the database; please try again. If the error persists please contact a system administrator for assistance.", "errorMessage" => "There was an error querying the database; please try again. If the error persists please contact a system administrator for assistance.", "errorType" => "queryError"));
    }
}

echo json_encode($output);