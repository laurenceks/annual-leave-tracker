<?php
require "../security/userLoginSecurityCheck.php";
require "../common/db.php";
require "../common/feedbackTemplate.php";
require "getAllowanceForCurrentUserQuery.php";

$output = array_merge($feedbackTemplate, array("allowances" => array()));
$input = json_decode(file_get_contents('php://input'), true);

$getAllAllowances = $db->prepare(getAllAllowancesQuery(), $_SESSION["user"]->userId);
$getAllAllowances->bindValue(':organisationId', $_SESSION["user"]->organisationId);
$getAllAllowances->execute();

$output["allowances"] = $getAllAllowances->fetchAll(PDO::FETCH_ASSOC);
$output["success"] = true;
$output["title"] = "Allowances updated";
$output["feedback"] = "Allowances data has been refreshed";

echo json_encode($output);
