<?php
require "../security/userLoginSecurityCheck.php";
require "../security/userAdminRightsCheck.php";
require_once "../common/db.php";
require "../common/checkEntryExists.php";

require "../common/feedbackTemplate.php";

$input = json_decode(file_get_contents('php://input'), true);

$output = $feedbackTemplate;

if (checkFunctionExists("pay_grades", "id", array(array("key" => "name", "value" => $input["inputAddPayGradeName"])))) {
    $output["feedback"] = "A pay grade with that name already exists, please change the pay grade name and try again";
    $output["title"] = "Pay grade already exists";
    $output["errorMessage"] = "Pay grade already exists";
    $output["errorType"] = "payGradeExists";
} else {
    try {
        $addPayGrade = $db->prepare("INSERT INTO pay_grades (organisationId, name, createdBy, editedBy) VALUES (:organisationId,:name, :uid1, :uid2)");
        $addPayGrade->bindValue(":organisationId", $_SESSION["user"]->organisationId);
        $addPayGrade->bindParam(":name", $input["inputAddPayGradeName"]);
        $addPayGrade->bindValue(":uid1", $_SESSION["user"]->userId);
        $addPayGrade->bindValue(":uid2", $_SESSION["user"]->userId);
        $addPayGrade->execute();
        $output["success"] = true;
        $output["title"] = "Pay grade added";
        $output["feedback"] = $input["inputAddPayGradeName"] . " was added successfully";
    } catch (PDOException $e) {
        $output = array_merge($output, array("feedback" => "There was an error querying the database; please try again. If the error persists please contact a system administrator for assistance.", "errorMessage" => "There was an error querying the database; please try again. If the error persists please contact a system administrator for assistance.", "errorType" => "queryError"));
    }
}

echo json_encode($output);