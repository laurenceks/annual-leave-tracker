<?php
//TODO also check period doesn't exist, if it does maybe update it?
function addAllowance($db, $input, $output) {
    try {
        $addAllowance = $db->prepare("INSERT INTO `allowances` (`userId`, `periodId`, `organisationId`, `hours`, `createdBy`, `editedBy`)
                                            VALUES (:userId, :periodId, :organisationId, :hours, :uid1, :uid2)");
        $addAllowance->bindValue(":organisationId", $_SESSION["user"]->organisationId);
        $addAllowance->bindParam(":userId", $input["userId"]);
        $addAllowance->bindParam(":periodId", $input["periodId"]);
        $addAllowance->bindParam(":hours", $input["hours"]);
        $addAllowance->bindValue(":uid1", $_SESSION["user"]->userId);
        $addAllowance->bindValue(":uid2", $_SESSION["user"]->userId);
        $addAllowance->execute();
        $output["success"] = true;
        $output["title"] = "Allowance added";
        $output["feedback"] = $input["userFullName"] . "'s allowance for " . $input["periodName"] . " of  " . $input["hours"] . " hours was added successfully";
    } catch (PDOException $e) {
        $output = array_merge($output, array("feedback" => "There was an error querying the database; please try again. If the error persists please contact a system administrator for assistance.", "errorMessage" => "There was an error querying the database; please try again. If the error persists please contact a system administrator for assistance.", "errorType" => "queryError"));
    }
    return $output;
}