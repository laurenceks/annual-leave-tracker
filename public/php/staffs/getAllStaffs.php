<?php
require "../security/userLoginSecurityCheck.php";
require "../common/db.php";
require "../common/feedbackTemplate.php";

$output = array_merge($feedbackTemplate, array("locations" => array()));
$input = json_decode(file_get_contents('php://input'), true);
$getAllStaff = $db->prepare("
SELECT 
  `users_info`.`userId` AS `id`,
       `users_info`.`firstName` AS `staffFirstName`,
       `users_info`.`lastName` AS `staffLastName`,
       CONCAT(`users_info`.`firstName`, ' ', `users_info`.`lastName`) AS `staffFullName`,
       `users_info`.`locationId`,
       `users_info`.`payGradeId`,
       `pay_grades`.`name` AS `payGradeName`,
       `users_info`.`locationId`,
       `locations`.`name` AS `locationName`
FROM 
  `users_info` 
LEFT JOIN `locations` ON `users_info`.`locationId` = `locations`.`id`
LEFT JOIN `pay_grades` ON `users_info`.`payGradeId` = `pay_grades`.`id`
WHERE 
  `users_info`.`organisationId` = :organisationId;");

$getAllStaff->bindValue(':organisationId', $_SESSION["user"]->organisationId);
$getAllStaff->execute();
$output["staff"] = $getAllStaff->fetchAll(PDO::FETCH_ASSOC);
$output["success"] = true;
$output["title"] = "Staff updated";
$output["feedback"] = "Staff data has been refreshed";

echo json_encode($output);
