<?php
require "../security/userLoginSecurityCheck.php";
require '../vendor/autoload.php';
require "../common/feedbackTemplate.php";

use Delight\Auth\Auth;

$auth = new Auth($db);

$output = array_merge($feedbackTemplate, array("users" => array()));

try {
    $getAllUsersMin = $db->prepare("
SELECT `users_info`.`userId` as `id`,
       `users_info`.`firstName`,
       `users_info`.`lastName`,
       CONCAT(`users_info`.`firstName`, ' ', `users_info`.`lastName`) AS `name`,
       `users_organisations`.`organisation`,
       `users_info`.`locationId`,
       `locations`.`name` AS `locationName`,
       `users_info`.`payGradeId`,
       `pay_grades`.`name` AS `payGradeName`
FROM `users_info`
         LEFT JOIN `users_organisations` ON `users_info`.`organisationId` = `users_organisations`.`id`
         LEFT JOIN `locations` ON `users_info`.`locationId` = `locations`.`id`
         LEFT JOIN `pay_grades` ON `users_info`.`payGradeId` = `pay_grades`.`id`
WHERE `users_info`.`organisationId` = :organisationId");
    $getAllUsersMin->bindValue(':organisationId', $_SESSION["user"]->organisationId);
    $getAllUsersMin->execute();

    $output["success"] = true;
    $output["title"] = "Users updated";
    $output["feedback"] = "Users data has been refreshed";
    $output["users"] = $getAllUsersMin->fetchAll(PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    $output["errorTypes"][] = "queryError";
    $output["feedback"] = "There was an error querying the database; please try again. If the error persists please contact a system administrator for assistance.";
    $output["errorMessage"] = "There was an error querying the database; please try again. If the error persists please contact a system administrator for assistance.";
    $output["errorType"] = "queryError";
}

echo json_encode($output);
