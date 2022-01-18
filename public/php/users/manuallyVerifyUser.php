<?php
require "../security/userLoginSecurityCheck.php";
require "../security/userAdminRightsCheck.php";
require "../common/simpleExecuteOutput.php";
require "../security/userSameOrganisationAsTargetCheck.php";

$input = json_decode(file_get_contents('php://input'), true);
targetHasSameOrganisationAsCurrentUser($input["userId"]);

$verifyUser = $db->prepare("UPDATE users SET verified = 1 WHERE id = :userId");
$verifyUser->bindParam(':userId', $input["userId"]);

echo json_encode(simpleExecuteOutput($verifyUser, array("title" => "User verified", "feedback" => $input["userFullName"] . " has been manually verified")));