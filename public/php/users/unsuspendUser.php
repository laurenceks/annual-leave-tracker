<?php
require "../security/userLoginSecurityCheck.php";
require "../security/userAdminRightsCheck.php";
require "../common/simpleExecuteOutput.php";
require "../security/userSameOrganisationAsTargetCheck.php";
require "../security/validateInputs.php";

$input = validateInputs();
targetHasSameOrganisationAsCurrentUser($input["userId"]);

$unsuspendUser = $db->prepare("UPDATE users_info SET suspended = 0 WHERE userId = :userId");
$unsuspendUser->bindParam(':userId', $input["userId"]);

echo json_encode(simpleExecuteOutput($unsuspendUser, array("title" => "User restored", "feedback" => $input["userFullName"] . " has been restored")));