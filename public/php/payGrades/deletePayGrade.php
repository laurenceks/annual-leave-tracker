<?php
require "../security/userLoginSecurityCheck.php";
require "../security/userAdminRightsCheck.php";
require_once "../common/db.php";
require "../common/checkFunctionExists.php";
require "../common/feedbackTemplate.php";

$input = json_decode(file_get_contents('php://input'), true);

$output = $feedbackTemplate;

if (!checkFunctionExists("pay_grades", "id", array(array("key" => "id", "value" => $input["id"])))) {
    $output["feedback"] = $input["name"] . " could not be found - possibly due to deletion - please try again";
    $output["title"] = "Missing pay grade";
    $output["errorMessage"] = $input["name"] . " could not be found";
    $output["errorType"] = "payGradeMissing";
} else {
    try {
        $deletePayGrade = $db->prepare("UPDATE pay_grades SET deleted = 1, editedBy = :uid WHERE id = :id AND organisationId = :organisationId");
        $deletePayGrade->bindValue(":organisationId", $_SESSION["user"]->organisationId);
        $deletePayGrade->bindParam(":id", $input["id"]);
        $deletePayGrade->bindValue(":uid", $_SESSION["user"]->userId);
        $deletePayGrade->execute();
        $output["success"] = true;
        $output["title"] = "Pay grade deleted";
        $output["feedback"] = $input["name"] . " was deleted successfully";
    } catch (PDOException $e) {
        $output = array_merge($output, array("feedback" => "There was an error querying the database; please try again. If the error persists please contact a system administrator for assistance.", "errorMessage" => "There was an error querying the database; please try again. If the error persists please contact a system administrator for assistance.", "errorType" => "queryError"));
    }
}

echo json_encode($output);