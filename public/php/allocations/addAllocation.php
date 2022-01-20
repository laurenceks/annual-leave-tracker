<?php
require "../security/userLoginSecurityCheck.php";
require_once "../common/db.php";
require "../common/checkFunctionExists.php";
require "../common/feedbackTemplate.php";
require "addAllocationFunction.php";

$input = json_decode(file_get_contents('php://input'), true);

$output = $feedbackTemplate;

$output = addAllocation($db, $input, $output);
echo json_encode($output);