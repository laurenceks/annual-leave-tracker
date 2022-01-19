<?php
require "../security/userLoginSecurityCheck.php";
require "../common/db.php";
require "../common/feedbackTemplate.php";

$output = array_merge($feedbackTemplate, array("allocations" => array()));
$input = json_decode(file_get_contents('php://input'), true);
//TODO make a fnuciton so can use userId or not
$getAllAllocations = $db->prepare("
SELECT `users`.`id`, `periods`.`id` AS `periodId`, `periods`.`name`, (SELECT `allocations`.`id` FROM `allocations` WHERE `allocations`.`userId` = `users`.`id` AND `allocations`.`periodId` = `periods`.`id`) AS `allocationId`, (SELECT `allocations`.`hours` FROM `allocations` WHERE `allocations`.`userId` = `users`.`id` AND `allocations`.`periodId` = `periods`.`id`) AS `hours` FROM `users` LEFT JOIN `users_info` ON `users`.`id` = `users_info`.`userId` LEFT JOIN `periods` ON `users_info`.`organisationId` = `periods`.`organisationId` WHERE `users_info`.`organisationId` = :organisationId
  ");

$getAllAllocations->bindValue(':organisationId', $_SESSION["user"]->organisationId);
$getAllAllocations->execute();
$output["allocations"] = $getAllAllocations->fetchAll(PDO::FETCH_ASSOC);
$output["success"] = true;
$output["title"] = "Allocations updated";
$output["feedback"] = "Allocations data has been refreshed";

echo json_encode($output);
