<?php
require "../security/userLoginSecurityCheck.php";
require_once "../common/db.php";
require "../common/checkFunctionExists.php";
require "../common/feedbackTemplate.php";

$input = json_decode(file_get_contents('php://input'), true);

$output = $feedbackTemplate;

if (isset($input["allowanceId"])) {
    //TODO check if allowance exists for given period and user
    try {
        $editAllowance = $db->prepare("UPDATE `allowances` SET `hours` = :hours, `editedBy` = :uid, `deleted` = 0 WHERE `id` = :allowanceId AND `organisationId` = :organisationId");
        $editAllowance->bindValue(":organisationId", $_SESSION["user"]->organisationId);
        $editAllowance->bindParam(":hours", $input["hours"]);
        $editAllowance->bindParam(":allowanceId", $input["allowanceId"]);
        $editAllowance->bindValue(":uid", $_SESSION["user"]->userId);
        $editAllowance->execute();
        $output["success"] = true;
        $output["title"] = "Allowance updated";
        $output["feedback"] = $input["userFullName"] . "'s allowance for " . $input["periodName"] . " was updated to  " . $input["hours"] . " hours successfully";
    } catch (PDOException $e) {
        $output = array_merge($output, array("feedback" => "There was an error querying the database; please try again. If the error persists please contact a system administrator for assistance.", "errorMessage" => "There was an error querying the database; please try again. If the error persists please contact a system administrator for assistance.", "errorType" => "queryError"));
    }
} else {
    require "addAllowanceFunction.php";
    $output = addAllowance($db, $input, $output);
}
echo json_encode($output);