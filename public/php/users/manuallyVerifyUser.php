<?php
require "../security/userLoginSecurityCheck.php";
require "../security/userAdminRightsCheck.php";
require "../common/simpleExecuteOutput.php";
require "../security/userSameOrganisationAsTargetCheck.php";
require "../security/validateInputs.php";

$input = validateInputs();
targetHasSameOrganisationAsCurrentUser($input["userId"]);

$verifyUser = $db->prepare("UPDATE users SET verified = 1 WHERE id = :userId");
$verifyUser->bindParam(':userId', $input["userId"]);

echo json_encode(simpleExecuteOutput($verifyUser, array("title" => "User verified", "feedback" => $input["userFullName"] . " has been manually verified")));