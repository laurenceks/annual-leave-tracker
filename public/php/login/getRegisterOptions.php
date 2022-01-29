<?php
require_once "../common/db.php";
$output = ["organisations" => [], "locations" => [], "payGrades" => []];
$output["organisations"] = $db->query("SELECT `id`, `organisation` AS `name` FROM `users_organisations`")->fetchAll(PDO::FETCH_ASSOC);
$output["locations"] = $db->query("SELECT `id`, `name`, `organisationId` FROM `locations` WHERE `deleted` = 0")->fetchAll(PDO::FETCH_ASSOC);
$output["payGrades"] = $db->query("SELECT `id`, `name`, `organisationId` FROM `pay_grades` WHERE `deleted` = 0")->fetchAll(PDO::FETCH_ASSOC);
echo json_encode($output);