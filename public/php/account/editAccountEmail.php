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
        if ($auth->reconfirmPassword($input['inputAccountPassword1'])) {
            $auth->changeEmail($input['inputAccountEmail'], function ($selector, $token) use ($input, $id, &$output) {
                require_once "../common/sendSmtpMail.php";
                require_once "../login/loginEmail/composeVerificationEmail.php";
                require "../common/appConfig.php";
//                require  "../login/logout.php";
                /*try {
                    $unverify = $db->prepare("UPDATE users SET verified = 0 WHERE id = :id");
                    $unverify->bindValue(":id", $id);
                    $unverify->execute();
                } catch (PDOException $e) {
                    $output["error"] = json_encode($e);
                }*/
                $emailParams = composeVerificationEmail($selector, $token, $input["firstName"], $appName);
                $mailToSend = composeSmtpMail($input['inputAccountEmail'], $input['firstName'] . " " . $input['lastName'], "Verify your " . $appName . " account", $emailParams["message"], $emailParams["messageAlt"]);
                $output["title"] = "Verification link sent";
                $output["feedback"] = "Email verification link sent; follow the link sent to " . $input['inputAccountEmail'] . " to finish changing your email address (or ignore it to keep your current one)";
                $output["mail"] = sendSmtpMail($mailToSend);
                $output["success"] = true;
            });
        } else {
            $output["title"] = "Incorrect password";
            $output["feedback"] = "Incorrect password entered";
            $output["errorMessage"] = "Incorrect password entered";
            $output["errorType"] = "incorrectPassword";
        }
    } catch (\Delight\Auth\InvalidEmailException $e) {
        $output["title"] = "Invalid email";
        $output["feedback"] = "Invalid email address entered";
        $output["errorMessage"] = "Invalid email address entered";
        $output["errorType"] = "invalidEmail";
    } catch (\Delight\Auth\UserAlreadyExistsException $e) {
        $output["title"] = "Email address in use";
        $output["feedback"] = "That email address already has an account";
        $output["errorMessage"] = "Email address in use";
        $output["errorType"] = "emailTaken";
    } catch (\Delight\Auth\EmailNotVerifiedException $e) {
        $output["title"] = "Unverified email";
        $output["feedback"] = "Your current email is not verified";
        $output["errorMessage"] = "Email not verified";
        $output["errorType"] = "emailNotVerified";
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