<?php
require "../security/userLoginSecurityCheck.php";
require_once "../common/db.php";
require "../common/checkFunctions/checkEntryExists.php";
require "../common/feedbackTemplate.php";

require "../security/validateInputs.php";

$input = validateInputs();
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