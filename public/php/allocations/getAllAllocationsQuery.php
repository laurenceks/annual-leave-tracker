<?php
function getAllAllocationsQuery($userId = null) {
    return "
SELECT `users`.`id` as `userId`,
       `users_info`.`firstName` as userFirstName,
       `users_info`.`lastName` as userLastName,
       CONCAT(`users_info`.`firstName`, ' ', `users_info`.`lastName`) AS `userFullName`,
       `users_organisations`.`organisation`,
       `locations`.`name` AS `locationName`,
       `pay_grades`.`name` AS `payGradeName`,
       `periods`.`name` as `periodName`,
       `periods`.`id` as `periodId`,
       (SELECT `allocations`.`id`
        FROM `allocations`
        WHERE `allocations`.`userId` = `users`.`id`
          AND `allocations`.`periodId` = `periods`.`id`) AS `allocationId`,
       (SELECT `allocations`.`hours`
        FROM `allocations`
        WHERE `allocations`.`userId` = `users`.`id`
          AND `allocations`.`periodId` = `periods`.`id`) AS `hours`,
       (SELECT `allocations`.`deleted`
        FROM `allocations`
        WHERE `allocations`.`userId` = `users`.`id`
          AND `allocations`.`periodId` = `periods`.`id`) AS `deleted`
FROM `users`
         LEFT JOIN `users_info` ON `users`.`id` = `users_info`.`userId`
         LEFT JOIN `periods` ON `users_info`.`organisationId` = `periods`.`organisationId`
         LEFT JOIN `users_organisations` ON `users_info`.`organisationId` = `users_organisations`.`id`
         LEFT JOIN `locations` ON `users_info`.`locationId` = `locations`.`id`
         LEFT JOIN `pay_grades` ON `users_info`.`payGradeId` = `pay_grades`.`id`
WHERE `users_info`.`organisationId` = :organisationId AND `periods`.`deleted` = 0" . ($userId ? " AND users.id = :userId " : " ") . "ORDER BY userId, periodId";
}