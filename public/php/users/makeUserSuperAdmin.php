<?php
require "../security/userLoginSecurityCheck.php";
require "../security/userSuperAdminRightsCheck.php";
require "../common/simpleExecuteOutput.php";
require '../vendor/autoload.php';
require "../security/userSameOrganisationAsTargetCheck.php";
require "../common/feedbackTemplate.php";

use Delight\Auth\Auth;
use Delight\Auth\Role;
use Delight\Auth\UnknownIdException;

require_once "../common/db.php";

$auth = new Auth($db);

$input = json_decode(file_get_contents('php://input'), true);
targetHasSameOrganisationAsCurrentUser($input["userId"]);
$output = $feedbackTemplate;

try {
    $auth->admin()->addRoleForUserById($input["userId"], Role::SUPER_ADMIN);
    $makeUserSuperAdmin = $db->prepare("UPDATE users_info SET superAdmin = 1 WHERE userId = :userId");
    $makeUserSuperAdmin->bindParam(':userId', $input["userId"]);
    $output["title"] = "User promoted";
    $output["feedback"] = $input["userFullName"] . " is now an admin";
    $output = simpleExecuteOutput($makeUserSuperAdmin, $output);
} catch (UnknownIdException $e) {
    $output = array_merge($output, $unknownUserIdOutput);
}

echo json_encode($output);