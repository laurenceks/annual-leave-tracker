<?php
require "../security/userLoginSecurityCheck.php";
require "../common/simpleExecuteOutput.php";
require '../vendor/autoload.php';
require_once "../common/db.php";
require "../common/feedbackTemplate.php";
require "../common/deleteUserById.php";

$input = json_decode(file_get_contents('php://input'), true);

use Delight\Auth\Auth;
use Delight\Auth\Role;
use Delight\Auth\UnknownIdException;

$auth = new Auth($db);

$input = json_decode(file_get_contents('php://input'), true);
$output = $feedbackTemplate;
$targetIsSuperAdmin = false;
$targetIsAdmin = false;
$currentIsSuperAdmin = $auth->admin()->doesUserHaveRole($auth->getUserId(), Role::SUPER_ADMIN);
$currentIsAdmin = $auth->admin()->doesUserHaveRole($auth->getUserId(), Role::ADMIN);
$sameUser = !(int)$input["userId"] === $auth->getUserId();
if (!$sameUser) {
    require "../security/userAdminRightsCheck.php";
}
try {
    $targetIsSuperAdmin = $auth->admin()->doesUserHaveRole($input["userId"], Role::SUPER_ADMIN);
} catch (UnknownIdException $e) {
    $output = array_merge($output, $unknownUserIdOutput);
}
try {
    $targetIsAdmin = $auth->admin()->doesUserHaveRole($input["userId"], Role::ADMIN);
} catch (UnknownIdException $e) {
    $output = array_merge($output, $unknownUserIdOutput);
}

if (!$targetIsSuperAdmin && !$targetIsAdmin && ($currentIsAdmin || $currentIsSuperAdmin) || $targetIsAdmin && $currentIsSuperAdmin || $sameUser) {
    //only delete if the target user is
    //- not an admin/superAdmin and the current user is an admin
    //- an admin but the current user is a super admin
    //- is the one being deleted
    $output = array_merge($output, deleteUserById($auth, $input["userId"], $_SESSION["user"]->organisationId, $input["maskedEmail"], $input["maskedFirstName"], $input["maskedLastName"]));
    if ($output["success"]) {
        $output["title"] = "User deleted";
        $output["feedback"] = $input["userFullName"] . "'s account has been deleted";
    }
} else {
    $output["title"] = "Forbidden";
    if ($targetIsSuperAdmin) {
        $output["feedback"] = "A super admin can only delete themselves or be deleted once demoted";
        $output["errorMessage"] = "A super admin can only delete themselves or be deleted once demoted";
        $output["errorType"] = "targetIsSuperAdmin";
    } else if ($targetIsAdmin && !$currentIsSuperAdmin) {
        $output["feedback"] = "An admin can only be deleted by a super admin or themselves";
        $output["title"] = "Forbidden";
        $output["errorMessage"] = "An admin can only be deleted by a super admin or themselves";
        $output["errorType"] = "targetIsSuperAdminAndUserIsNotSuperAdmin";
    } else if (!$currentIsAdmin && !$currentIsSuperAdmin && !$sameUser) {
        $output["feedback"] = "Admin rights are needed to delete users other than yourself";
        $output["errorMessage"] = "Admin rights are needed to delete users other than yourself";
        $output["errorType"] = "userIsNotAdmin";
    } else {
        $output["feedback"] = "An unknown permissions error occurred";
        $output["errorMessage"] = "An unknown permissions error occurred";
        $output["errorType"] = "unknownPermissionsError";
    }
}

echo json_encode($output);