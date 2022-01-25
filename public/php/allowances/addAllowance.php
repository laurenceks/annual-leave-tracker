<?php
require "../security/userLoginSecurityCheck.php";
require_once "../common/db.php";
require "../common/checkFunctionExists.php";
require "../common/feedbackTemplate.php";
require "addAllowanceFunction.php";

$input = json_decode(file_get_contents('php://input'), true);

$output = $feedbackTemplate;

$output = addAllowance($db, $input, $output);
echo json_encode($output);