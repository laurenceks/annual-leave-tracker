<?php
$dashboardChartMonthQuery = "
SELECT MONTHNAME(`aDate`) AS `month`,
IFNULL((SELECT SUM(`hours`) FROM `bookings` WHERE `dateFrom` >= @`minDate` AND `dateTo` <= @`maxDate` AND MONTHNAME(`dateFrom`) = MONTHNAME(`aDate`) AND `userId` = @`userId` AND `organisationId` = @`organisationId` AND `deleted` = 0), 0) AS `hours`,
IFNULL((SELECT SUM(`hours`) FROM `bookings` WHERE `dateFrom` >= @`minDate` AND `dateTo` <= @`maxDate` AND MONTHNAME(`dateFrom`) = MONTHNAME(`aDate`) AND `status` = 'approved' AND `userId` = @`userId` AND `organisationId` = @`organisationId` AND `deleted` = 0 AND `dateFrom` > CURRENT_DATE()), 0) AS `approved`,
IFNULL((SELECT SUM(`hours`) FROM `bookings` WHERE `dateFrom` >= @`minDate` AND `dateTo` <= @`maxDate` AND MONTHNAME(`dateFrom`) = MONTHNAME(`aDate`) AND `status` = 'requested' AND `userId` = @`userId` AND `organisationId` = @`organisationId` AND `deleted` = 0), 0) AS `requested`,
IFNULL((SELECT SUM(`hours`) FROM `bookings` WHERE `dateFrom` >= @`minDate` AND `dateTo` <= @`maxDate` AND MONTHNAME(`dateFrom`) = MONTHNAME(`aDate`) AND `status` = 'denied' AND `userId` = @`userId` AND `organisationId` = @`organisationId` AND `deleted` = 0), 0) AS `denied`,
IFNULL((SELECT SUM(`hours`) FROM `bookings` WHERE `dateFrom` >= @`minDate` AND `dateTo` <= @`maxDate` AND MONTHNAME(`dateFrom`) = MONTHNAME(`aDate`) AND `status` = 'approved' AND `userId` = @`userId` AND `organisationId` = @`organisationId` AND `deleted` = 0 AND `dateFrom` <= CURRENT_DATE()), 0) AS `taken`
FROM (
  SELECT @`maxDate` - INTERVAL (`a`.`a` + (10 * `b`.`a`) + (100 * `c`.`a`)) MONTH AS `aDate` FROM
  (SELECT 0 AS `a` UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3
   UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL
   SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) `a`,
  (SELECT 0 AS `a` UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3
   UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL
   SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) `b`,
  (SELECT 0 AS `a` UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3
   UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL
   SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) `c`,
  (SELECT @`minDate` := :dateFrom, @`maxDate` := :dateTo, @`userId` := :userId, @`organisationId` := :organisationId) `d`
) `e`

WHERE `aDate` BETWEEN @`minDate` AND @`maxDate`
ORDER BY `aDate` ASC;
";