<?php
require "../security/userLoginSecurityCheck.php";
require "../security/userAdminRightsCheck.php";
require "../common/db.php";
require "../common/feedbackTemplate.php";

$output = array_merge($feedbackTemplate, array("bookings" => array()));
$input = json_decode(file_get_contents('php://input'), true);
$getAllBookings = $db->prepare("SELECT `bookings`.*,
       `users_info`.`firstName`,
       `users_info`.`lastName`,
       CONCAT(`users_info`.`firstName`, ' ', `users_info`.`lastName`) AS `userFullName`,
       `users_organisations`.`organisation`,
       `locations`.`name` AS `locationName`,
       `pay_grades`.`name` AS `payGradeName`,
       IFNULL((SELECT SUM(`hours`)
               FROM `bookings` `b`
                        LEFT JOIN `users_info` ON `bookings`.`userId` = `users_info`.`userId`
                        LEFT JOIN `locations` ON `users_info`.`locationId` = `locations`.`id`
                        LEFT JOIN `pay_grades` ON `users_info`.`payGradeId` = `pay_grades`.`id`
               WHERE `bookings`.`organisationId` = :organisationId1
                 AND `bookings`.`status` = 'approved'
                 AND `bookings`.`dateFrom` = `b`.`dateFrom`
                 AND `users_info`.`locationId` = `locations`.`id`
                 AND `users_info`.`payGradeId` = `pay_grades`.`id`), 0) AS `approvedAtLocationForPayGrade`,
       `pay_grades`.`name` AS `payGradeName`
FROM `bookings`
         LEFT JOIN `users_info` ON `bookings`.`userId` = `users_info`.`userId`
         LEFT JOIN `users_organisations` ON `users_info`.`organisationId` = `users_organisations`.`id`
         LEFT JOIN `locations` ON `users_info`.`locationId` = `locations`.`id`
         LEFT JOIN `pay_grades` ON `users_info`.`payGradeId` = `pay_grades`.`id`
WHERE `bookings`.`organisationId` = :organisationId2
  AND `bookings`.`deleted` = 0
");

$getAllBookings->bindValue(':organisationId1', $_SESSION["user"]->organisationId);
$getAllBookings->bindValue(':organisationId2', $_SESSION["user"]->organisationId);
$getAllBookings->execute();
$output["bookings"] = $getAllBookings->fetchAll(PDO::FETCH_ASSOC);
$output["success"] = true;
$output["title"] = "Bookings updated";
$output["feedback"] = "Bookings data has been refreshed";

echo json_encode($output);
