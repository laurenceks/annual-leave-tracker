<?php
require '../../vendor/autoload.php';

use Delight\Auth\Auth;
use Delight\Auth\ConfirmationRequestNotFound;
use Delight\Auth\TooManyRequestsException;

require_once "../../common/db.php";
require "../../security/validateInputs.php";

$auth = new Auth($db);

$input = validateInputs();
$output = array(
    "success" => false,
    "feedback" => "An unknown error occurred",
    "mail" => new stdClass(),
    "keepFormActive" => false
);

try {
    $auth->resendConfirmationForEmail($input["inputReVerifyEmail"], function ($selector, $token) use ($input, &$output) {
        require_once "../../common/sendSmtpMail.php";
        require_once "../loginEmail/composeVerificationEmail.php";
        require "../../common/getUserInfo.php";
        require "../../common/getUserIdFromSelector.php";
        require "../../common/appConfig.php";
        $name = getUserInfo(getUserIdFromSelector($selector, "users_confirmations"))->firstName;
        $emailParams = composeVerificationEmail($selector, $token, $name, $appName);
        $mailToSend = composeSmtpMail($input['inputReVerifyEmail'], $name, "Verify your " . $appName . " account", $emailParams["message"], $emailParams["messageAlt"]);
        $output["mail"] = sendSmtpMail($mailToSend);
    });
    $output["success"] = true;
    $output["feedback"] = "Verification email re-sent, please check " . $input["inputReVerifyEmail"] . " for a verification link";
} catch (ConfirmationRequestNotFound $e) {
    $output["feedback"] = "No verification found to re-send - are your already verified or did you forget to register?";
    $output["errorMessage"] = "No verification found to re-send";
    $output["errorType"] = "noVerificationFound";
    $output["keepFormActive"] = true;
} catch (TooManyRequestsException $e) {
    $output["feedback"] = "There have been too many requests, please try again later";
    $output["errorMessage"] = "There have been too many requests, please try again later";
    $output["errorType"] = "tooManyRequests";
}

echo json_encode($output);