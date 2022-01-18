<?php
require "../security/userLoginSecurityCheck.php";
require '../vendor/autoload.php';
require_once "../common/db.php";
require "../common/feedbackTemplate.php";
require "../common/deleteUserById.php";

$input = json_decode(file_get_contents('php://input'), true);

use Delight\Auth\Auth;
use Delight\Auth\Role;

$auth = new Auth($db);

$input = json_decode(file_get_contents('php://input'), true);
$output = $feedbackTemplate;
$targetIsSuperAdmin = false;
$targetIsAdmin = false;
$currentIsSuperAdmin = $auth->admin()->doesUserHaveRole($auth->getUserId(), Role::SUPER_ADMIN);
$currentIsAdmin = $auth->admin()->doesUserHaveRole($auth->getUserId(), Role::ADMIN);
$sameUser = ((int)$input["userId"] === $auth->getUserId()) && ((int)$_SESSION["user"]->id === $auth->getUserId());
if ($sameUser) {
    if ($auth->reconfirmPassword($input['inputAccountDeletePassword1'])) {
        $output = array_merge($output, deleteUserById($auth, $auth->getUserId(), $_SESSION["user"]->organisationId, $input["maskedEmail"], $input["maskedFirstName"], $input["maskedLastName"]));
        if ($output["success"]) {
            //success - log user out
            require "../login/logout.php";
            $output["failedLoginCheck"] = true;
        }
    } else {
        $output["title"] = "Incorrect password";
        $output["feedback"] = "Incorrect password entered";
        $output["errorMessage"] = "Incorrect password entered";
        $output["errorType"] = "incorrectPassword";
    }
} else {
    //different users error - shouldn't be possible but requires a log out
    require "../login/logout.php";
    $output["title"] = "Mismatched user";
    $output["feedback"] = "The user trying to deleted their account is not the one logged in to the server in this session";
    $output["errorMessage"] = "notSameUser";
    $output["failedLoginCheck"] = true;
}
echo json_encode($output);