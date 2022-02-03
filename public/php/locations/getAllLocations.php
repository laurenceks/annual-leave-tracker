<?php
require "../security/userLoginSecurityCheck.php";
require "../common/db.php";
require "../common/feedbackTemplate.php";

$output = array_merge($feedbackTemplate, array("locations" => array()));
$getAllLocations = $db->prepare("
SELECT 
  *
FROM 
  locations 
WHERE 
  locations.organisationId = :organisationId;");

$getAllLocations->bindValue(':organisationId', $_SESSION["user"]->organisationId);
$getAllLocations->execute();
$output["locations"] = $getAllLocations->fetchAll(PDO::FETCH_ASSOC);
$output["success"] = true;
$output["title"] = "Locations updated";
$output["feedback"] = "Locations data has been refreshed";

echo json_encode($output);
