<?php
require "../security/userLoginSecurityCheck.php";
require_once "../common/db.php";
require "../common/checkFunctionExists.php";
require "../common/feedbackTemplate.php";

$input = json_decode(file_get_contents('php://input'), true);

$output = $feedbackTemplate;

if (isset($input["allocationId"])) {
    //TODO check if allocation exists for given period and user
    try {
        $editAllocation = $db->prepare("UPDATE `allocations` SET `hours` = :hours, `editedBy` = :uid, `deleted` = 0 WHERE `id` = :allocationId AND `organisationId` = :organisationId");
        $editAllocation->bindValue(":organisationId", $_SESSION["user"]->organisationId);
        $editAllocation->bindParam(":hours", $input["hours"]);
        $editAllocation->bindParam(":allocationId", $input["allocationId"]);
        $editAllocation->bindValue(":uid", $_SESSION["user"]->userId);
        $editAllocation->execute();
        $output["success"] = true;
        $output["title"] = "Allocation updated";
        $output["feedback"] = $input["userFullName"] . "'s allocation for " . $input["periodName"] . " was updated to  " . $input["hours"] . " hours successfully";
    } catch (PDOException $e) {
        $output = array_merge($output, array("feedback" => "There was an error querying the database; please try again. If the error persists please contact a system administrator for assistance.", "errorMessage" => "There was an error querying the database; please try again. If the error persists please contact a system administrator for assistance.", "errorType" => "queryError"));
    }
} else {
    require "addAllocationFunction.php";
    $output = addAllocation($db, $input, $output);
}
echo json_encode($output);