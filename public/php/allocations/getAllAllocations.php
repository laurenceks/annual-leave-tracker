<?php
require "../security/userLoginSecurityCheck.php";
require "../common/db.php";
require "../common/feedbackTemplate.php";
require "getAllocationForCurrentUserQuery.php";

$output = array_merge($feedbackTemplate, array("allocations" => array()));
$input = json_decode(file_get_contents('php://input'), true);

$getAllAllocations = $db->prepare(getAllAllocationsQuery());
$getAllAllocations->bindValue(':organisationId', $_SESSION["user"]->organisationId);
$getAllAllocations->execute();

$output["allocations"] = $getAllAllocations->fetchAll(PDO::FETCH_ASSOC);
$output["success"] = true;
$output["title"] = "Allocations updated";
$output["feedback"] = "Allocations data has been refreshed";

echo json_encode($output);
