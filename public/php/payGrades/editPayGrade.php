<?php
require "../security/userLoginSecurityCheck.php";
require "../security/userAdminRightsCheck.php";
require_once "../common/db.php";
require "../common/checkEntryExists.php";
require "../common/feedbackTemplate.php";

$input = json_decode(file_get_contents('php://input'), true);

$output = $feedbackTemplate;

if (!checkFunctionExists("pay_grades", "id", array(array("key" => "id", "value" => $input["id"])))) {
    $output["feedback"] = $input["name"] . " could not be found - possibly due to deletion - please try again";
    $output["title"] = "Missing pay grade";
    $output["errorMessage"] = $input["name"] . " could not be found";
    $output["errorType"] = "payGradeMissing";
} else if (checkFunctionExists("pay_grades", "name", array(array("key" => "name", "value" => $input["name"])), false, true, $input["id"])) {
    $output["feedback"] = "A pay grade with that name already exists, please change the pay grade name and try again";
    $output["title"] = "Pay grade already exists";
    $output["errorMessage"] = "Pay grade already exists";
    $output["errorType"] = "payGradeExists";
} else {
    try {
        $editPayGrade = $db->prepare("UPDATE pay_grades SET name = :name, editedBy = :uid WHERE id = :id AND organisationId = :organisationId");
        $editPayGrade->bindValue(":organisationId", $_SESSION["user"]->organisationId);
        $editPayGrade->bindParam(":name", $input["name"]);
        $editPayGrade->bindParam(":id", $input["id"]);
        $editPayGrade->bindValue(":uid", $_SESSION["user"]->userId);
        $editPayGrade->execute();
        $output["success"] = true;
        $output["title"] = "Pay grade updated";
        $output["feedback"] = $input["name"] . " was updated successfully";
    } catch (PDOException $e) {
        $output = array_merge($output, array("feedback" => "There was an error querying the database; please try again. If the error persists please contact a system administrator for assistance.", "errorMessage" => "There was an error querying the database; please try again. If the error persists please contact a system administrator for assistance.", "errorType" => "queryError"));
    }
}

echo json_encode($output);