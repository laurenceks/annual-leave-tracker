<?php
require '../vendor/autoload.php';
use Delight\Auth\Auth;
use Delight\Auth\UnknownIdException;

function deleteUserById($auth, $id, $orgId, $maskedEmail, $maskedFirstName, $maskedLastName) {
    try {
        require "../security/userSameOrganisationAsTargetCheck.php";
        require "../common/db.php";
        require_once "../common/simpleExecuteOutput.php";
        targetHasSameOrganisationAsCurrentUser($id);
        $auth->admin()->deleteUserById($id);

        $db->setAttribute(PDO::ATTR_EMULATE_PREPARES, true);
        $deleteUserFromDb = $db->prepare("
DELETE FROM `users_confirmations` WHERE user_id = :userId;
DELETE FROM `users_resets` WHERE user = :userId;
DELETE FROM `users_remembered` WHERE user = :userId;
DELETE FROM `users_info` WHERE userId = :userId;
");
        $insertUserIntoDeletedUsers = $db->prepare("INSERT INTO deleted_users (userId, organisationId, email, firstName, lastName) VALUES (:userId, :organisationId, :email, :firstName, :lastName)");
        $insertUserIntoDeletedUsers->bindValue(':userId', $id);
        $insertUserIntoDeletedUsers->bindValue(':organisationId', $orgId);
        $insertUserIntoDeletedUsers->bindValue(':email', $maskedEmail);
        $insertUserIntoDeletedUsers->bindValue(':firstName', $maskedFirstName);
        $insertUserIntoDeletedUsers->bindValue(':lastName', $maskedLastName);
        $insertOutput = simpleExecuteOutput($insertUserIntoDeletedUsers);

        $deleteUserFromDb->bindValue(':userId', $id);
        $db->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
        $deleteOutput = simpleExecuteOutput($deleteUserFromDb);

        $output["success"] = $insertOutput["success"] && $deleteOutput["success"];
        $output["insertOutput"] = $insertOutput;
        $output["deleteOutput"] = $deleteOutput;
    } catch (UnknownIdException $e) {
        require "../common/feedbackTemplate.php";
        $output = $unknownUserIdOutput;
    }
    return $output;
}