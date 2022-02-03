<?php
require '../../vendor/autoload.php';

use Delight\Auth\Auth;
use Delight\Auth\InvalidPasswordException;
use Delight\Auth\InvalidSelectorTokenPairException;
use Delight\Auth\ResetDisabledException;
use Delight\Auth\TokenExpiredException;
use Delight\Auth\TooManyRequestsException;

require_once "../../common/db.php";
require "../../security/validateInputs.php";

$auth = new Auth($db);

$input = validateInputs();
$output = array("success" => false, "feedback" => "An unknown error occurred", "input" => $input);

if (!$input || !$input['selector'] || !$input['token']) {
    $output["feedback"] = "Parameters did not reach server";
} else {
    try {
        require_once "../../common/getUserInfo.php";
        require_once "../../common/getUserIdFromSelector.php";

        $userDetails = getUserInfo(getUserIdFromSelector($input['selector'], "users_resets"));

        if ($userDetails) {

            $auth->resetPassword($input['selector'], $input['token'], $input['inputPasswordResetPassword']);

            require_once "../../common/sendSmtpMail.php";
            require_once "../loginEmail/composeLoginEmail.php";
            require "../../common/appConfig.php";

            $emailParams = composeLoginEmail(array(
                "headline" => $appName . " password reset",
                "subheadline" => "Your password has been reset, " . $userDetails->firstName,
                "body" => "Your account password has been reset. If this wasn't you, click the button below and then \"Forgot password\" change your password again.",
                "buttonText" => "Login",
                "alt" => "Your " . $appName . " account password has been reset",
                "url" => "/#/login",
            ));
            $mailToSend = composeSmtpMail($userDetails->email, $userDetails->firstName . " " . $userDetails->lastName, $appName . " password reset", $emailParams["message"], $emailParams["messageAlt"]);
            $output["mail"] = sendSmtpMail($mailToSend);
            $output["feedback"] = 'Password has been reset';
            $output["success"] = true;
        } else {
            $output["feedback"] = 'Selector could not be matched to a user';
            $output["errorMessage"] = "Invalid selector";
            $output["errorType"] = "invalidSelector";
        }
    } catch (InvalidSelectorTokenPairException $e) {
        $output["feedback"] = "Invalid token";
        $output["errorMessage"] = "Invalid token";
        $output["errorType"] = "invalidToken";
    } catch (TokenExpiredException $e) {
        $output["feedback"] = "Token expired";
        $output["errorMessage"] = "Token expired";
        $output["errorType"] = "tokenExpired";
    } catch (InvalidPasswordException  $e) {
        $output["feedback"] = "Invalid password";
        $output["errorMessage"] = "Invalid password";
        $output["errorType"] = "invalidPassword";
    } catch (ResetDisabledException  $e) {
        $output["feedback"] = "Password resets are not allowed for this account - please contact your organisation's administrator";
        $output["errorMessage"] = "Password resets are not allowed for this account - please contact your organisation's administrator";
        $output["errorType"] = "resetDisabled";
    } catch (TooManyRequestsException $e) {
        $output["feedback"] = "Too many requests - please try again later";
        $output["errorMessage"] = "Too many requests";
        $output["errorType"] = "tooManyRequests";
    }
}
echo json_encode($output);