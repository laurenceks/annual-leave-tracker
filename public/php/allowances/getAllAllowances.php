<?php
require "../security/userLoginSecurityCheck.php";
require "../common/db.php";
require "../common/feedbackTemplate.php";
require "getAllAllowancesQuery.php";

$output = array_merge($feedbackTemplate, array("allowances" => array()));

$getAllAllowances = $db->prepare(getAllAllowancesQuery());
$getAllAllowances->bindValue(':organisationId', $_SESSION["user"]->organisationId);
$getAllAllowances->execute();

$previousRow = array("allowanceId" => null, "userId" => null);
$allAllowances = $getAllAllowances->fetchAll(PDO::FETCH_ASSOC);
foreach ($allAllowances as $row) {
    if ($previousRow["userId"] === $row["userId"]) {
        $output["allowances"][count($output["allowances"]) - 1]["periods"][] = array_slice($row, 7);
    } else {
        $output["allowances"][] = array("userId" => $row["userId"], "userFirstName" => $row["userFirstName"], "userLastName" => $row["userLastName"], "userFullName" => $row["userFullName"], "locationName" => $row["locationName"], "payGradeName" => $row["payGradeName"], "deleted" => $row["deleted"], "periods" => array(array_slice($row, 7)));
    }
    $previousRow = $row;
}

$output["success"] = true;
$output["title"] = "Allowances updated";
$output["feedback"] = "Allowances data has been refreshed";

echo json_encode($output);
