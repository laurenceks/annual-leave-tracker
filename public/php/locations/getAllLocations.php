<?php
require "../security/userLoginSecurityCheck.php";
require "../common/db.php";
require "../common/feedbackTemplate.php";

$output = array_merge($feedbackTemplate, array("locations" => array()));
$input = json_decode(file_get_contents('php://input'), true);
$getAllLocations = $db->prepare("
SELECT 
  *, 
  (
    SELECT 
      CAST(SUM(transactions.quantity) AS SIGNED)
    FROM 
      transactions 
    WHERE 
      organisationId = :organisationId1 
      AND deleted = 0 
      AND locationId = locations.id
  ) AS currentStock
FROM 
  locations 
WHERE 
  locations.organisationId = :organisationId2 
  " . ((isset($input["includeLocations"]) ? $input["includeLocations"] : false) ? "AND locations.deleted = 0;" : ";"));

$getAllLocations->bindValue(':organisationId1', $_SESSION["user"]->organisationId);
$getAllLocations->bindValue(':organisationId2', $_SESSION["user"]->organisationId);
$getAllLocations->execute();
$output["locations"] = $getAllLocations->fetchAll(PDO::FETCH_ASSOC);
$output["success"] = true;
$output["title"] = "Locations updated";
$output["feedback"] = "Locations data has been refreshed";

echo json_encode($output);
