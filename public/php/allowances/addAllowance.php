<?php
require "../security/userLoginSecurityCheck.php";
require_once "../common/db.php";
require "../common/checkFunctions/checkEntryExists.php";
require "../common/feedbackTemplate.php";
require "addAllowanceFunction.php";

require "../security/validateInputs.php";

$input = validateInputs();
$output = $feedbackTemplate;

$output = addAllowance($db, $input, $output);
echo json_encode($output);