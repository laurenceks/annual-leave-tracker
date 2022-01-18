<?php
require '../../vendor/autoload.php';

use Delight\Auth\Auth;
use Delight\Auth\InvalidSelectorTokenPairException;
use Delight\Auth\ResetDisabledException;
use Delight\Auth\TokenExpiredException;
use Delight\Auth\TooManyRequestsException;

require_once "../../common/db.php";

$auth = new Auth($db);

$input = json_decode(file_get_contents('php://input'), true);

$output = array("success" => false, "feedback" => "An unknown error occurred", "input" => $input);

if (!$input || !$input['selector'] || !$input['token']) {
    $output["feedback"] = "Parameters did not reach server";
} else {
    try {
        $auth->canResetPasswordOrThrow($input['selector'], $input['token']);

        $output["feedback"] = 'Password reset request has been verified';
        $output["success"] = true;
    } catch (InvalidSelectorTokenPairException $e) {
        $output["feedback"] = "Invalid token";
        $output["errorMessage"] = "Invalid token";
        $output["errorType"] = "invalidToken";
    } catch (TokenExpiredException $e) {
        $output["feedback"] = "Token expired";
        $output["errorMessage"] = "Token expired";
        $output["errorType"] = "tokenExpired";
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