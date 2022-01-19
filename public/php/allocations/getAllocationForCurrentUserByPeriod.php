<?php
function getAllAllocationsQuery($userId = null) {
    return "
SELECT `users`.`id`,
       `periods`.`id`
           AS `periodId`,
       `periods`.`name`,
       (SELECT `allocations`.`id`
        FROM `allocations`
        WHERE `allocations`.`userId` = `users`.`id`
          AND `allocations`.`periodId` = `periods`.`id`) AS `allocationId`,
       (SELECT `allocations`.`hours`
        FROM `allocations`
        WHERE `allocations`.`userId` = `users`.`id`
          AND `allocations`.`periodId` = `periods`.`id`) AS `hours`
FROM `users`
         LEFT JOIN `users_info` ON `users`.`id` = `users_info`.`userId`
         LEFT JOIN `periods` ON `users_info`.`organisationId` = `periods`.`organisationId`
WHERE `users_info`.`organisationId` = :organisationId" . ($userId ? "AND users.id = :userId" : "");
}