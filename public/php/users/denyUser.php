<?php
require "../security/userLoginSecurityCheck.php";
require "../security/userAdminRightsCheck.php";
require "../common/simpleExecuteOutput.php";
require "../security/userSameOrganisationAsTargetCheck.php";
require '../vendor/autoload.php';
require "../common/db.php";
require "../common/feedbackTemplate.php";
require "../security/validateInputs.php";

use Delight\Auth\Auth;
use Delight\Auth\UnknownIdException;

$auth = new Auth($db);
$input = validateInputs();
targetHasSameOrganisationAsCurrentUser($input["userId"]);
$output = $feedbackTemplate;

try {
    $auth->admin()->deleteUserById($input["userId"]);
    $denyUser = $db->prepare("DELETE FROM users_info WHERE userId = :userId;");
    $denyUser->bindParam(':userId', $input["userId"]);
    if ($denyUser->execute()) {
        $denyUser = $db->prepare('UPDATE users_confirmations SET email = CONCAT(SUBSTRING(email, 1, 1), REGEXP_REPLACE(SUBSTRING(email, 2, POSITION("@" IN email)-3), "[A-z]", "*"),SUBSTRING(email, POSITION("@" IN email)-1, 1), "@", SUBSTRING(email, POSITION("@" IN email)+1, 1), REGEXP_REPLACE(SUBSTRING(email, POSITION("@" IN email)+2, LENGTH(email) - POSITION("@" IN email)-2), "[A-z]", "*"), SUBSTRING(email, LENGTH(email), 1)) WHERE user_id = :userId');
        $denyUser->bindParam(':userId', $input["userId"]);
        if ($denyUser->execute()) {
            $output["success"] = true;
            $output["title"] = "Approval request denied";
            $output["feedback"] = "User approval request denied and account deleted";
        } else {
            //TODO make these more specific
            $output["feedback"] = "Unable to deny approval request";
            $output["errorMessage"] = "Unable to deny approval request";
            $output["errorType"] = "unableToDeny";
        }
    } else {
        $output["feedback"] = "Unable to deny approval request";
        $output["errorMessage"] = "Unable to deny approval request";
        $output["errorType"] = "unableToDeny";
    }

} catch (UnknownIdException $e) {
    $output = array_merge($output, $unknownUserIdOutput);
}

echo json_encode($output);