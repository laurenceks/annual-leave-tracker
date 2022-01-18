<?php
require "../security/userLoginSecurityCheck.php";
require "../security/userSuperAdminRightsCheck.php";
require "../common/simpleExecuteOutput.php";
require '../vendor/autoload.php';
require "../security/userSameOrganisationAsTargetCheck.php";
require "../common/feedbackTemplate.php";
require_once "../common/db.php";

use Delight\Auth\Auth;
use Delight\Auth\Role;
use Delight\Auth\UnknownIdException;

$auth = new Auth($db);

$input = json_decode(file_get_contents('php://input'), true);
targetHasSameOrganisationAsCurrentUser($input["userId"]);
$output = $feedbackTemplate;

try {
    $auth->admin()->removeRoleForUserById($input["userId"], Role::ADMIN);
    $auth->admin()->removeRoleForUserById($input["userId"], Role::SUPER_ADMIN);
    $makeAdminUser = $db->prepare("UPDATE users_info SET admin = 0, superAdmin = 0 WHERE userId = :userId");
    $makeAdminUser->bindParam(':userId', $input["userId"]);
    $output["title"] = "User demoted";
    $output["feedback"] = $input["userFullName"] . " is now a normal user";
    $output = simpleExecuteOutput($makeAdminUser, $output);
} catch (UnknownIdException $e) {
    $output = array_merge($output, $unknownUserIdOutput);
}

echo json_encode($output);