<?php
require "../security/userLoginSecurityCheck.php";
require "../security/userAdminRightsCheck.php";
require "../common/simpleExecuteOutput.php";
require "../security/userSameOrganisationAsTargetCheck.php";

$input = json_decode(file_get_contents('php://input'), true);
targetHasSameOrganisationAsCurrentUser($input["userId"]);

$approveUser = $db->prepare("UPDATE users_info SET approved = 1 WHERE userId = :userId");
$approveUser->bindParam(':userId', $input["userId"]);

echo json_encode(simpleExecuteOutput($approveUser, array("title" => "User approved", "feedback" => $input["userFullName"] . " has been approved")));