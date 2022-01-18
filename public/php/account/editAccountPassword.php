<?php

require "../security/userLoginSecurityCheck.php";
require_once "../common/db.php";
require "../common/feedbackTemplate.php";

use Delight\Auth\Auth;

$auth = new Auth($db);
$id = $auth->getUserId();

$input = json_decode(file_get_contents('php://input'), true);

$output = $feedbackTemplate;

if (!$id = $_SESSION["user"]->id) {
    //not the same user as logged in - shouldn't be possible
    $output["feedback"] = "A user can only update their own account";
    $output["errorMessage"] = "A user can only update their own account";
    $output["errorType"] = "userIdMismatch";
} else {
    try {
        $auth->changePassword($input["inputAccountOldPassword"], $input["inputAccountNewPassword1"]);
        $output["title"] = "Password changed";
        $output["feedback"] = "Your password has been changed";
        $output["success"] = true;
    } catch (\Delight\Auth\InvalidPasswordException  $e) {
        $output["title"] = "Invalid password(s)";
        $output["feedback"] = "One or more of the passwords provided were invalid";
        $output["errorMessage"] = "Invalid password(s)";
        $output["errorType"] = "invalidPasswords";
    } catch (\Delight\Auth\NotLoggedInException $e) {
        $output["failedLoginCheck"] = true;
        $output["feedback"] = "You are not logged in";
        $output["errorMessage"] = "You are not logged in";
        $output["errorType"] = "notLoggedIn";
    } catch (\Delight\Auth\TooManyRequestsException $e) {
        $output["title"] = "Too many requests";
        $output["feedback"] = "Too many requests - please try again later";
        $output["errorMessage"] = "Too many requests";
        $output["errorType"] = "tooManyRequests";
    }
}


echo json_encode($output);