<?php
//TODO add sum columns for total, location, paygrade
$hoursByDateAndUserQuery = "SELECT CASE :interval WHEN 'month' THEN MONTHNAME(`aDate`) WHEN 'year' THEN YEAR(`aDate`) ELSE `aDate` END AS `date`,
       `approved`.`bookingId`,
       `approved`.`userId`,
       `approved`.`firstName`,
       `approved`.`lastName`,
       `approved`.`hours`,
       `approved`.`locationId`,
       `approved`.`locationName`,
       `approved`.`payGradeId`,
       `approved`.`payGradeName`
FROM (
         SELECT @`maxDate` - INTERVAL (`a`.`a` + (10 * `b`.`a`) + (100 * `c`.`a`)) DAY AS `aDate`
         FROM (SELECT 0 AS `a`
               UNION ALL
               SELECT 1
               UNION ALL
               SELECT 2
               UNION ALL
               SELECT 3
               UNION ALL
               SELECT 4
               UNION ALL
               SELECT 5
               UNION ALL
               SELECT 6
               UNION ALL
               SELECT 7
               UNION ALL
               SELECT 8
               UNION ALL
               SELECT 9) `a`,
              (SELECT 0 AS `a`
               UNION ALL
               SELECT 1
               UNION ALL
               SELECT 2
               UNION ALL
               SELECT 3
               UNION ALL
               SELECT 4
               UNION ALL
               SELECT 5
               UNION ALL
               SELECT 6
               UNION ALL
               SELECT 7
               UNION ALL
               SELECT 8
               UNION ALL
               SELECT 9) `b`,
              (SELECT 0 AS `a`
               UNION ALL
               SELECT 1
               UNION ALL
               SELECT 2
               UNION ALL
               SELECT 3
               UNION ALL
               SELECT 4
               UNION ALL
               SELECT 5
               UNION ALL
               SELECT 6
               UNION ALL
               SELECT 7
               UNION ALL
               SELECT 8
               UNION ALL
               SELECT 9) `c`,
              (SELECT @`minDate` := :minType,
                      @`maxDate` := :maxDate,
                      @`organisationId` := :organisationId) `d`
     ) `e`
         LEFT JOIN (SELECT `bookings`.`id` AS `bookingId`,
                           `bookings`.`userId`,
                           `bookings`.`hours`,
                           `bookings`.`dateFrom`,
                           `users_info`.`firstName`,
                           `users_info`.`lastName`,
                           `users_info`.`locationId`,
                           `locations`.`name` AS `locationName`,
                           `users_info`.`payGradeId`,
                           `pay_grades`.`name` AS `payGradeName`
                    FROM `bookings`
                             LEFT JOIN `users_info` ON `bookings`.`userId` = `users_info`.`userId`
                             LEFT JOIN `locations` ON `users_info`.`locationId` = `locations`.`id`
                             LEFT JOIN `pay_grades` ON `users_info`.`payGradeId` = `pay_grades`.`id`
                    WHERE `status` = 'approved'
                      AND `bookings`.`organisationId` = 5) `approved`
                   ON (`approved`.`dateFrom` >= `e`.`aDate`
                       AND CASE :interval1
                               WHEN 'day' THEN `approved`.`dateFrom` < (`e`.`aDate` + INTERVAL 1 DAY)
                               WHEN 'week' THEN `approved`.`dateFrom` < (`e`.`aDate` + INTERVAL 1 WEEK)
                               WHEN 'month' THEN `approved`.`dateFrom` < LAST_DAY(`e`.`aDate`)
                               WHEN 'year' THEN `approved`.`dateFrom` < (`e`.`aDate` + INTERVAL 1 YEAR)
                           END)
WHERE `aDate` BETWEEN @`minDate` AND @`maxDate`
  AND CASE :interval2
          WHEN 'week' THEN WEEKDAY(`aDate`) = :weekDayStart
          WHEN 'month' THEN `aDate` = DATE_ADD(DATE_ADD(LAST_DAY(`aDate`), INTERVAL 1 DAY), INTERVAL -1 MONTH)
          ELSE TRUE END
ORDER BY `aDate`, `locationId`;";

$hoursByDateSplitQuery = "SELECT CASE @`interval` WHEN 'month' THEN DATE_FORMAT(`aDate`, '%b %y') WHEN 'year' THEN YEAR(`aDate`) ELSE `aDate` END AS `date`,
       IF(@`splitByLocation` = TRUE, `locations`.`id`, NULL) AS `locationId`,
       IF(@`splitByLocation` = TRUE, `locations`.`name`, NULL) AS `locationName`,
       IF(@`splitByPayGrade` = TRUE, `pay_grades`.`id`, NULL) AS `payGradeId`,
       IF(@`splitByPayGrade` = TRUE, `pay_grades`.`name`, NULL) AS `payGradeName`,
       IFNULL((SELECT COUNT(`bookings`.`id`)
               FROM `bookings`
                        LEFT JOIN `users_info` ON `bookings`.`userId` = `users_info`.`userId`
               WHERE IF(@`splitByLocation` = TRUE, `users_info`.`locationId` = `locations`.`id`, TRUE)
                 AND IF(@`splitByPayGrade` = TRUE, `users_info`.`payGradeId` = `pay_grades`.`id`, TRUE)
                 AND (`bookings`.`dateFrom` >= `e`.`aDate`
                   AND CASE @`interval`
                           WHEN 'day' THEN `bookings`.`dateFrom` < (`e`.`aDate` + INTERVAL 1 DAY)
                           WHEN 'week' THEN `bookings`.`dateFrom` < (`e`.`aDate` + INTERVAL 1 WEEK)
                           WHEN 'month' THEN `bookings`.`dateFrom` < LAST_DAY(`e`.`aDate`)
                           WHEN 'year' THEN `bookings`.`dateFrom` < DATE(CONCAT(YEAR(`aDate`), '-12-31'))
                          END)
                 AND `bookings`.`organisationId` = @`organisationId`
                 AND `bookings`.`status` = 'approved')
           , 0) AS `approvedBookings`,
       IFNULL((SELECT SUM(`hours`)
               FROM `bookings`
                        LEFT JOIN `users_info` ON `bookings`.`userId` = `users_info`.`userId`
               WHERE IF(@`splitByLocation` = TRUE, `users_info`.`locationId` = `locations`.`id`, TRUE)
                 AND IF(@`splitByPayGrade` = TRUE, `users_info`.`payGradeId` = `pay_grades`.`id`, TRUE)
                 AND (`bookings`.`dateFrom` >= `e`.`aDate`
                   AND CASE @`interval`
                           WHEN 'day' THEN `bookings`.`dateFrom` < (`e`.`aDate` + INTERVAL 1 DAY)
                           WHEN 'week' THEN `bookings`.`dateFrom` < (`e`.`aDate` + INTERVAL 1 WEEK)
                           WHEN 'month' THEN `bookings`.`dateFrom` < LAST_DAY(`e`.`aDate`)
                           WHEN 'year' THEN `bookings`.`dateFrom` < DATE(CONCAT(YEAR(`aDate`), '-12-31'))
                          END)
                 AND `bookings`.`organisationId` = @`organisationId`
                 AND `bookings`.`status` = 'approved')
           , 0) AS `hours`
FROM (
         SELECT @`maxDate` - INTERVAL (`a`.`a` + (10 * `b`.`a`) + (100 * `c`.`a`)) DAY AS `aDate`
         FROM (SELECT 0 AS `a`
               UNION ALL
               SELECT 1
               UNION ALL
               SELECT 2
               UNION ALL
               SELECT 3
               UNION ALL
               SELECT 4
               UNION ALL
               SELECT 5
               UNION ALL
               SELECT 6
               UNION ALL
               SELECT 7
               UNION ALL
               SELECT 8
               UNION ALL
               SELECT 9) `a`,
              (SELECT 0 AS `a`
               UNION ALL
               SELECT 1
               UNION ALL
               SELECT 2
               UNION ALL
               SELECT 3
               UNION ALL
               SELECT 4
               UNION ALL
               SELECT 5
               UNION ALL
               SELECT 6
               UNION ALL
               SELECT 7
               UNION ALL
               SELECT 8
               UNION ALL
               SELECT 9) `b`,
              (SELECT 0 AS `a`
               UNION ALL
               SELECT 1
               UNION ALL
               SELECT 2
               UNION ALL
               SELECT 3
               UNION ALL
               SELECT 4
               UNION ALL
               SELECT 5
               UNION ALL
               SELECT 6
               UNION ALL
               SELECT 7
               UNION ALL
               SELECT 8
               UNION ALL
               SELECT 9) `c`,
              (SELECT @`minDate` := :minDate,
                      @`maxDate` := :maxDate,
                      @`splitByPayGrade` := :splitByPayGrade,
                      @`splitByLocation` := :splitByLocation,
                      @`interval` := :interval,
                      @`groupSplitBy` := :groupSplitBy,
                      @`organisationId` := :organisationId) `d`
     ) `e`
         CROSS JOIN `locations`
         CROSS JOIN `pay_grades`
WHERE `aDate` BETWEEN @`minDate` AND @`maxDate`
  AND `locations`.`organisationId` = @`organisationId`
  AND `pay_grades`.`organisationId` = @`organisationId`
  AND `locations`.`deleted` = 0
  AND CASE @`interval`
          WHEN 'week' THEN WEEKDAY(`aDate`) = :weekDayStart
          WHEN 'month' THEN `aDate` = DATE_ADD(DATE_ADD(LAST_DAY(`aDate`), INTERVAL 1 DAY), INTERVAL -1 MONTH)
          WHEN 'year' THEN `aDate` = DATE(CONCAT(YEAR(`aDate`), '-01-01'))
          ELSE TRUE END
GROUP BY `aDate`, IF(@`groupSplitBy` = 'locationId', `locationId`, `payGradeId`), IF(@`groupSplitBy` = 'locationId', `payGradeId`, `locationId`)
ORDER BY `aDate`, IF(@`groupSplitBy` = 'locationId', `locationId`, `payGradeId`), IF(@`groupSplitBy` = 'locationId', `payGradeId`, `locationId`);";