<?php
require "../security/userLoginSecurityCheck.php";
require "../common/db.php";
require "../common/feedbackTemplate.php";

$output = array_merge($feedbackTemplate, array("periods" => array()));
$input = json_decode(file_get_contents('php://input'), true);
$getAllPeriods = $db->prepare("
SELECT 
  *
FROM 
  periods 
WHERE 
  periods.organisationId = :organisationId;");

$getAllPeriods->bindValue(':organisationId', $_SESSION["user"]->organisationId);
$getAllPeriods->execute();
$output["periods"] = $getAllPeriods->fetchAll(PDO::FETCH_ASSOC);
$output["success"] = true;
$output["title"] = "Periods updated";
$output["feedback"] = "Periods data has been refreshed";

echo json_encode($output);
