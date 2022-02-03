<?php
require "../security/userLoginSecurityCheck.php";
require "../security/userAdminRightsCheck.php";
require "../common/simpleExecuteOutput.php";
require '../vendor/autoload.php';
require "../security/userSameOrganisationAsTargetCheck.php";
require_once "../common/db.php";
require "../common/feedbackTemplate.php";
require "../security/validateInputs.php";

use Delight\Auth\Auth;
use Delight\Auth\Role;
use Delight\Auth\UnknownIdException;

$auth = new Auth($db);

$input = validateInputs();
targetHasSameOrganisationAsCurrentUser($input["userId"]);
$output = $feedbackTemplate;
$targetIsSuperAdmin = false;

try {
    $targetIsSuperAdmin = $auth->admin()->doesUserHaveRole($input["userId"], Role::SUPER_ADMIN);
} catch (UnknownIdException $e) {
    $output = array_merge($output, $unknownUserIdOutput);
}
try {
    if (!$targetIsSuperAdmin || ($targetIsSuperAdmin && (int)$input["userId"] === $auth->getUserId())) {
        $auth->admin()->addRoleForUserById($input["userId"], Role::ADMIN);
        $auth->admin()->removeRoleForUserById($input["userId"], Role::SUPER_ADMIN);
        $makeUserAdmin = $db->prepare("UPDATE users_info SET admin = 1, superAdmin = 0 WHERE userId = :userId");
        $makeUserAdmin->bindParam(':userId', $input["userId"]);
        $output["title"] = "User promoted";
        $output["feedback"] = $input["userFullName"] . " is now an admin";
        $output = simpleExecuteOutput($makeUserAdmin, $output);
    } else {
        $output["title"] = "Forbidden";
        $output["feedback"] = "A super admin can only renounce their own super admin rights";
        $output["errorMessage"] = "A super admin can only renounce their own super admin rights";
        $output["errorType"] = "targetIsSuperAdmin";
    }
} catch (UnknownIdException $e) {
    $output = array_merge($output, $unknownUserIdOutput);
}

echo json_encode($output);