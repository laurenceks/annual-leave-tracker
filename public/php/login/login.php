<?php
require '../vendor/autoload.php';

use Delight\Auth\Auth;
use Delight\Auth\EmailNotVerifiedException;
use Delight\Auth\InvalidEmailException;
use Delight\Auth\InvalidPasswordException;
use Delight\Auth\TooManyRequestsException;

require_once "../common/db.php";

$auth = new Auth($db);

$input = json_decode(file_get_contents('php://input'), true);

$output = array("success" => false, "feedback" => "An unknown error occurred", "user" => array());

try {
    $rememberDuration = $input["inputLoginRemember"] == "true" ? 60 * 60 * 48 : null;
    $auth->login($input['inputLoginEmail'], $input['inputLoginPassword'], $rememberDuration);
    require_once "../common/getUserInfo.php";
    try {
        $output["user"] = getUserInfo($auth->getUserId(), $auth);
        $_SESSION["user"] = $output["user"];
        if ($output["user"]->approved && !$output["user"]->suspended) {
            $output["success"] = true;
            $output["feedback"] = "User is logged in";
        } else if (!$output["user"]->approved) {
            $output["success"] = false;
            $output["feedback"] = "Your account is pending approval by an organisation admin";
            $output["errorMessage"] = "Account is pending approval by an organisation admin";
            $output["errorType"] = "accountPendingApproval";
        } else if ($output["user"]->suspended) {
            $output["success"] = false;
            $output["feedback"] = "Your account has been suspended by an organisational admin";
            $output["errorMessage"] = "Account has been suspended by an organisational admin";
            $output["errorType"] = "accountSuspended";
        } else {
            $output["success"] = false;
            $output["feedback"] = "Your account credentials are invalid - please contact an organisational admin";
            $output["errorMessage"] = "Your account credentials are invalid";
            $output["errorType"] = "invalidCredentials";
        }
    } catch (exception $e) {
        $output = array_merge($output, array("feedback" => "There was an error querying the database; please try again. If the error persists please contact a system administrator for assistance.", "errorMessage" => "There was an error querying the database; please try again. If the error persists please contact a system administrator for assistance.", "errorType" => "queryError"));
    }

} catch (InvalidEmailException $e) {
    $output["feedback"] = "Wrong or unknown email/password";
    $output["errorMessage"] = "Wrong or unknown email/password";
    $output["errorType"] = "wrongEmailOrPassword";
} catch (InvalidPasswordException $e) {
    $output["feedback"] = "Wrong or unknown email/password";
    $output["errorMessage"] = "Wrong or unknown email/password";
    $output["errorType"] = "wrongEmailOrPassword";
} catch (EmailNotVerifiedException $e) {
    $output["feedback"] = "Email not verified";
    $output["errorMessage"] = "Email not verified";
    $output["errorType"] = "emailNotVerified";
} catch (TooManyRequestsException $e) {
    $output["feedback"] = "Too many requests - please try again later";
    $output["errorMessage"] = "Too many requests";
    $output["errorType"] = "tooManyRequests";
}

echo json_encode($output);