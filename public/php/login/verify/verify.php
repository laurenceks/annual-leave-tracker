<?php
require '../../vendor/autoload.php';

use Delight\Auth\Auth;
use Delight\Auth\InvalidSelectorTokenPairException;
use Delight\Auth\TokenExpiredException;
use Delight\Auth\TooManyRequestsException;
use Delight\Auth\UserAlreadyExistsException;

require_once "../../common/db.php";
require "../../security/validateInputs.php";

$auth = new Auth($db);

$input = validateInputs();
$output = array("success" => false, "feedback" => "An unknown error occurred");

if (!$input || !$input['selector'] || !$input['token']) {
    $output["feedback"] = "Parameters did not reach server";
    $output["errorMessage"] = "Parameters did not reach server";
    $output["errorType"] = "noParameters";
} else {
    try {
        $auth->confirmEmail($input['selector'], $input['token']);
        $output["feedback"] = "Email address has been verified";
        $output["success"] = true;
    } catch (InvalidSelectorTokenPairException $e) {
        $output["feedback"] = "Invalid token";
        $output["errorMessage"] = "Invalid token";
        $output["errorType"] = "invalidToken";
    } catch (TokenExpiredException $e) {
        $output["feedback"] = "Token expired";
        $output["errorMessage"] = "Token expired";
        $output["errorType"] = "tokenExpired";
    } catch (UserAlreadyExistsException $e) {
        $output["feedback"] = "Email address already verified";
        $output["errorMessage"] = "Email address already verified";
        $output["errorType"] = "emailAlreadyVerified";
    } catch (TooManyRequestsException $e) {
        $output["feedback"] = "Too many requests - please try again later";
        $output["errorMessage"] = "Too many requests";
        $output["errorType"] = "tooManyRequests";
    }
}
echo json_encode($output);