<?php
require "../security/userLoginSecurityCheck.php";
require "../security/userAdminRightsCheck.php";
require "../common/simpleExecuteOutput.php";
require "../security/userSameOrganisationAsTargetCheck.php";
require "../security/validateInputs.php";

$input = validateInputs();
targetHasSameOrganisationAsCurrentUser($input["userId"]);

$suspendUser = $db->prepare("UPDATE users_info SET suspended = 1 WHERE userId = :userId");
$suspendUser->bindParam(':userId', $input["userId"]);

echo json_encode(simpleExecuteOutput($suspendUser, array("title" => "User suspended", "feedback" => $input["userFullName"] . " has been suspended")));