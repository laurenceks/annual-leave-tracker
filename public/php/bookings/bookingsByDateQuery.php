<?php
$bookingsByDateQuery = "SELECT `aDate` AS `date`,
       IFNULL((SELECT SUM(`hours`)
               FROM `bookings`
                        LEFT JOIN `users_info` ON `bookings`.`userId` = `users_info`.`userId`
               WHERE `dateFrom` = `aDate`
                 AND `bookings`.`organisationId` = @`organisationId`
                 AND `users_info`.`locationId` = @`locationId`
                 AND `users_info`.`payGradeId` = @`payGradeId`
                 AND `bookings`.`deleted` = 0
                 AND `bookings`.`status` = 'requested'
              ), 0) AS `requestedHours`,
       (SELECT COUNT(`bookings`.`id`)
        FROM `bookings`
                 LEFT JOIN `users_info` ON `bookings`.`userId` = `users_info`.`userId`
        WHERE `dateFrom` = `aDate`
          AND `bookings`.`organisationId` = @`organisationId`
          AND `users_info`.`locationId` = @`locationId`
          AND `users_info`.`payGradeId` = @`payGradeId`
          AND `bookings`.`deleted` = 0
          AND `bookings`.`status` = 'requested'
       ) AS `requestedBookings`,
       IFNULL((SELECT SUM(`hours`)
               FROM `bookings`
                        LEFT JOIN `users_info` ON `bookings`.`userId` = `users_info`.`userId`
               WHERE `dateFrom` = `aDate`
                 AND `bookings`.`organisationId` = @`organisationId`
                 AND `users_info`.`locationId` = @`locationId`
                 AND `users_info`.`payGradeId` = @`payGradeId`
                 AND `bookings`.`deleted` = 0
                 AND `bookings`.`status` = 'approved'
              ), 0) AS `approvedHours`,
       (SELECT COUNT(`bookings`.`id`)
        FROM `bookings`
                 LEFT JOIN `users_info` ON `bookings`.`userId` = `users_info`.`userId`
        WHERE `dateFrom` = `aDate`
          AND `bookings`.`organisationId` = @`organisationId`
          AND `users_info`.`locationId` = @`locationId`
          AND `users_info`.`payGradeId` = @`payGradeId`
          AND `bookings`.`deleted` = 0
          AND `bookings`.`status` = 'approved'
       ) AS `approvedBookings`,
       IFNULL((SELECT SUM(`hours`)
               FROM `bookings`
                        LEFT JOIN `users_info` ON `bookings`.`userId` = `users_info`.`userId`
               WHERE `dateFrom` = `aDate`
                 AND `bookings`.`organisationId` = @`organisationId`
                 AND `users_info`.`locationId` = @`locationId`
                 AND `users_info`.`payGradeId` = @`payGradeId`
                 AND `bookings`.`deleted` = 0
                 AND `bookings`.`status` != 'denied'
              ), 0) AS `totalHours`,
       (SELECT COUNT(`bookings`.`id`)
        FROM `bookings`
                 LEFT JOIN `users_info` ON `bookings`.`userId` = `users_info`.`userId`
        WHERE `dateFrom` = `aDate`
          AND `bookings`.`organisationId` = @`organisationId`
          AND `users_info`.`locationId` = @`locationId`
          AND `users_info`.`payGradeId` = @`payGradeId`
          AND `bookings`.`deleted` = 0
          AND `bookings`.`status` != 'denied'
       ) AS `totalBookings`
FROM (
         SELECT ADDDATE(@`minDate`,
                        `t4`.`i` * 10000 + `t3`.`i` * 1000 + `t2`.`i` * 100 + `t1`.`i` * 10 +
                        `t0`.`i`) AS `aDate`
         FROM (SELECT 0 `i`
               UNION
               SELECT 1
               UNION
               SELECT 2
               UNION
               SELECT 3
               UNION
               SELECT 4
               UNION
               SELECT 5
               UNION
               SELECT 6
               UNION
               SELECT 7
               UNION
               SELECT 8
               UNION
               SELECT 9) `t0`,
              (SELECT 0 `i`
               UNION
               SELECT 1
               UNION
               SELECT 2
               UNION
               SELECT 3
               UNION
               SELECT 4
               UNION
               SELECT 5
               UNION
               SELECT 6
               UNION
               SELECT 7
               UNION
               SELECT 8
               UNION
               SELECT 9) `t1`,
              (SELECT 0 `i`
               UNION
               SELECT 1
               UNION
               SELECT 2
               UNION
               SELECT 3
               UNION
               SELECT 4
               UNION
               SELECT 5
               UNION
               SELECT 6
               UNION
               SELECT 7
               UNION
               SELECT 8
               UNION
               SELECT 9) `t2`,
              (SELECT 0 `i`
               UNION
               SELECT 1
               UNION
               SELECT 2
               UNION
               SELECT 3
               UNION
               SELECT 4
               UNION
               SELECT 5
               UNION
               SELECT 6
               UNION
               SELECT 7
               UNION
               SELECT 8
               UNION
               SELECT 9) `t3`,
              (SELECT 0 `i`
               UNION
               SELECT 1
               UNION
               SELECT 2
               UNION
               SELECT 3
               UNION
               SELECT 4
               UNION
               SELECT 5
               UNION
               SELECT 6
               UNION
               SELECT 7
               UNION
               SELECT 8
               UNION
               SELECT 9) `t4`,
              (SELECT @`minDate` := :dateFrom,
                      @`maxDate` := :dateTo,
                      @`organisationId` := :organisationId,
                      @`payGradeId` := :payGradeId,
                      @`locationId` := :locationId) `t5`
     ) `v`
WHERE `aDate` BETWEEN @`minDate` AND @`maxDate`
ORDER BY `aDate`;";