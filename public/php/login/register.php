<?php
require '../vendor/autoload.php';

use Delight\Auth\Auth;
use Delight\Auth\InvalidEmailException;
use Delight\Auth\InvalidPasswordException;
use Delight\Auth\Role;
use Delight\Auth\TooManyRequestsException;
use Delight\Auth\UnknownIdException;
use Delight\Auth\UserAlreadyExistsException;


require_once "../common/db.php";

$auth = new Auth($db);

$input = json_decode(file_get_contents('php://input'), true);

$output = array("success" => false, "feedback" => "An unknown error occurred", "mail" => new stdClass());

try {
    $userId = $auth->register($input['inputRegisterEmail'], $input['inputRegisterPassword'], null, function ($selector, $token) use ($input, &$output) {
        require_once "../common/sendSmtpMail.php";
        require_once "loginEmail/composeVerificationEmail.php";
        require "../common/appConfig.php";

        $emailParams = composeVerificationEmail($selector, $token, $input["inputRegisterFirstName"], $appName);
        $mailToSend = composeSmtpMail($input['inputRegisterEmail'], $input['inputRegisterFirstName'] . " " . $input['inputRegisterLastName'], "Verify your " . $appName . " account", $emailParams["message"], $emailParams["messageAlt"]);
        $output["mail"] = sendSmtpMail($mailToSend);
    });
    try {
        $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $admin = 0;
        $superAdmin = 0;
        $approved = 0;
        if (isset($input["organisation"]["customOption"]) && $input["organisation"]["customOption"]) {
            //new organisation - add to DB list and mark user as an admin
            $superAdmin = 1;
            $approved = 1;
            $addOrganisation = $db->prepare("INSERT INTO users_organisations (organisation, createdBy, editedBy) VALUES (:organisation, :uId1, :uId2)");
            $addOrganisation->bindValue(":organisation", $input["inputRegisterOrganisation"]);
            $addOrganisation->bindValue(":uId1", $userId);
            $addOrganisation->bindValue(":uId2", $userId);
            $addOrganisation->execute();
            $organisationId = $db->lastInsertId();
            $output["organisationId"] = $organisationId;

            //add new default location for new organisation
            $addLocation = $db->prepare("INSERT INTO locations (organisationId, createdBy, editedBy) VALUES (:organisationId, :uId3, :uId4)");
            $addLocation->bindValue(":organisationId", $organisationId);
            $addLocation->bindValue(":uId3", $userId);
            $addLocation->bindValue(":uId4", $userId);
            $addLocation->execute();
            $locationId = $db->lastInsertId();

            $output["locationId"] = $locationId;


        } else {
            //organisation exists - just use passed organisationId
            $organisationId = $input["organisation"]["id"];
        }

        $addUserInfo = $db->prepare("INSERT INTO users_info (userId, firstName, lastName, admin, superAdmin, approved, organisationId) VALUES (:userId, :firstname, :lastname, :admin, :superAdmin, :approved, :organisationId)");
        $addUserInfo->bindParam(':userId', $userId);
        $addUserInfo->bindParam(':firstname', $input['inputRegisterFirstName']);
        $addUserInfo->bindParam(':lastname', $input['inputRegisterLastName']);
        $addUserInfo->bindParam(':admin', $admin);
        $addUserInfo->bindParam(':superAdmin', $superAdmin);
        $addUserInfo->bindParam(':approved', $approved);
        $addUserInfo->bindParam(':organisationId', $organisationId);

        $addUserInfo->execute();
    } catch (PDOException $e) {
        $output = array_merge($output, array("feedback" => "There was an error querying the database; please try again. If the error persists please contact a system administrator for assistance.", "errorMessage" => "There was an error querying the database; please try again. If the error persists please contact a system administrator for assistance.", "errorType" => "queryError"));
    }

    if (isset($input["organisation"]["customOption"]) && $input["organisation"]["customOption"]) {
        try {
            //new organisation - make super admin
            $auth->admin()->addRoleForUserById($userId, Role::SUPER_ADMIN);
        } catch (UnknownIdException $e) {
            $output["feedback"] = "Unable to assign user super admin role, please contact the support team";
            $output["errorMessage"] = "Unable to assign user super admin role";
            $output["errorType"] = "unableToAssignSuperAdmin";
        }
    }

    $output["success"] = true;
    $output["feedback"] = "You have successfully registered, please check " . $input["inputRegisterEmail"] . " for a verification link";
    $output["id"] = $userId;
} catch (InvalidEmailException $e) {
    $output["feedback"] = "Invalid email address";
    $output["errorMessage"] = "Invalid email address";
    $output["errorType"] = "invalidEmail";
} catch (InvalidPasswordException $e) {
    $output["feedback"] = "Invalid password";
    $output["errorMessage"] = "Invalid password";
    $output["errorType"] = "invalidPassword";
} catch (UserAlreadyExistsException $e) {
    $output["feedback"] = "User already exists";
    $output["errorMessage"] = "User already exists";
    $output["errorType"] = "userExists";
} catch (TooManyRequestsException $e) {
    $output["feedback"] = "Too many requests - please try again later";
    $output["errorMessage"] = "Too many requests";
    $output["errorType"] = "tooManyRequests";
}

echo json_encode($output);