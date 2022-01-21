<?php
//TODO also check period doesn't exist, if it does maybe update it?
function addAllocation($db, $input, $output) {
    try {
        $addAllocation = $db->prepare("INSERT INTO `allocations` (`userId`, `periodId`, `organisationId`, `hours`, `createdBy`, `editedBy`)
                                            VALUES (:userId, :periodId, :organisationId, :hours, :uid1, :uid2)");
        $addAllocation->bindValue(":organisationId", $_SESSION["user"]->organisationId);
        $addAllocation->bindParam(":userId", $input["userId"]);
        $addAllocation->bindParam(":periodId", $input["periodId"]);
        $addAllocation->bindParam(":hours", $input["hours"]);
        $addAllocation->bindValue(":uid1", $_SESSION["user"]->userId);
        $addAllocation->bindValue(":uid2", $_SESSION["user"]->userId);
        $addAllocation->execute();
        $output["success"] = true;
        $output["title"] = "Allocation added";
        $output["feedback"] = $input["userFullName"] . "'s allocation for " . $input["periodName"] . " of  " . $input["hours"] . " hours was added successfully";
    } catch (PDOException $e) {
        $output = array_merge($output, array("feedback" => "There was an error querying the database; please try again. If the error persists please contact a system administrator for assistance.", "errorMessage" => "There was an error querying the database; please try again. If the error persists please contact a system administrator for assistance.", "errorType" => "queryError"));
    }
    return $output;
}