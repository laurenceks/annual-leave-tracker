<?php
require "../security/userLoginSecurityCheck.php";
require "../security/userAdminRightsCheck.php";
require "../common/simpleExecuteOutput.php";
require "../security/userSameOrganisationAsTargetCheck.php";

$input = json_decode(file_get_contents('php://input'), true);
targetHasSameOrganisationAsCurrentUser($input["userId"]);

$suspendUser = $db->prepare("UPDATE users_info SET suspended = 1 WHERE userId = :userId");
$suspendUser->bindParam(':userId', $input["userId"]);

echo json_encode(simpleExecuteOutput($suspendUser, array("title" => "User suspended", "feedback" => $input["userFullName"] . " has been suspended")));