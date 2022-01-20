<?php
require "../security/userLoginSecurityCheck.php";
require "../common/db.php";
require "../common/feedbackTemplate.php";
require "getAllAllocationsQuery.php";

$output = array_merge($feedbackTemplate, array("allocations" => array()));
$input = json_decode(file_get_contents('php://input'), true);

$getAllAllocations = $db->prepare(getAllAllocationsQuery());
$getAllAllocations->bindValue(':organisationId', $_SESSION["user"]->organisationId);
$getAllAllocations->execute();

$previousRow = array("allocationId" => null, "userId" => null);
$allAllocations = $getAllAllocations->fetchAll(PDO::FETCH_ASSOC);
foreach ($allAllocations as $row) {
    if ($previousRow["userId"] === $row["userId"]) {
        $output["allocations"][count($output["allocations"]) - 1]["periods"][] = array_slice($row, 7);
    } else {
        $output["allocations"][] = array("userId" => $row["userId"], "userFirstName" => $row["userFirstName"], "userLastName" => $row["userLastName"], "userFullName" => $row["userFullName"], "locationName" => $row["locationName"], "payGradeName" => $row["payGradeName"], "deleted" => $row["deleted"], "periods" => array(array_slice($row, 7)));
    }
    $previousRow = $row;
}

$output["success"] = true;
$output["title"] = "Allocations updated";
$output["feedback"] = "Allocations data has been refreshed";

echo json_encode($output);
