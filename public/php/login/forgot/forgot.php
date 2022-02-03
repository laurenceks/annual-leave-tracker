<?php
require '../../vendor/autoload.php';

use Delight\Auth\Auth;
use Delight\Auth\EmailNotVerifiedException;
use Delight\Auth\InvalidEmailException;
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
    $auth->forgotPassword($input["inputForgotEmail"], function ($selector, $token) use ($input, &$output) {
        require_once "../../common/sendSmtpMail.php";
        require_once "../loginEmail/composeLoginEmail.php";
        require "../../common/getUserInfo.php";
        require "../../common/getUserIdFromSelector.php";
        require "../../common/appConfig.php";

        $name = getUserInfo(getUserIdFromSelector($selector, "users_resets"))->firstName;
        $forgotUrl = '/resetPassword?selector=' . urlencode($selector) . '&token=' . urlencode($token);
        $emailParams = composeLoginEmail(array(
            "headline" => $appName . " account recovery",
            "subheadline" => "Reset your password, " . $name,
            "body" => "Recover your " . $appName . " account by clicking on the link below:",
            "buttonText" => "Reset password",
            "alt" => "Please copy and paste the below link into your browser to recover your " . $appName . " account.\n\r\n\r" . $forgotUrl,
            "url" => $forgotUrl,
        ));
        $mailToSend = composeSmtpMail($input["inputForgotEmail"], $name, $appName . " password reset", $emailParams["message"], $emailParams["messageAlt"]);
        $output["mail"] = sendSmtpMail($mailToSend);
    });
    $output["success"] = true;
    $output["feedback"] = "Password reset email sent, please check " . $input["inputForgotEmail"] . " for a recovery link";
} catch (InvalidEmailException $e) {
    $output["feedback"] = "Unknown email address, please check for typos or register";
    $output["errorMessage"] = "Unknown email address";
    $output["keepFormActive"] = true;
    $output["errorType"] = "unknownEmail";
} catch (EmailNotVerifiedException $e) {
    $output["feedback"] = "Email not verified";
    $output["errorMessage"] = "Email not verified";
    $output["errorType"] = "unverifiedEmail";
} catch (TooManyRequestsException $e) {
    $output["feedback"] = "There have been too many requests, please try again later";
    $output["errorMessage"] = "Too many requests";
    $output["errorType"] = "tooManyRequests";
}

echo json_encode($output);