<?php
require "../security/userLoginSecurityCheck.php";
require "../security/userAdminRightsCheck.php";
require '../vendor/autoload.php';
require "../common/feedbackTemplate.php";

use Delight\Auth\Auth;
use Delight\Auth\Role;

$auth = new Auth($db);

$output = array_merge($feedbackTemplate, array("users" => array(), "isOneOfManySuperAdmins" => false));

try {
    $getAllUsers = $db->prepare("
            SELECT users.email, users.verified, users_info.*, users_organisations.*
            FROM users
            LEFT JOIN users_info ON users.id = users_info.userId
            LEFT JOIN users_organisations ON users_info.organisationId = users_organisations.id
            WHERE users_info.organisationId = :organisationId");
    $getAllUsers->bindValue(':organisationId', $_SESSION["user"]->organisationId);
    $getAllUsers->execute();
    $output["success"] = true;
    $output["title"] = "Users updated";
    $output["feedback"] = "Users data has been refreshed";
    $output["users"] = $getAllUsers->fetchAll(PDO::FETCH_ASSOC);
    if ($auth->hasRole(Role::SUPER_ADMIN)) {
        $isSuperAdminAndThereIsMoreThanOne = $db->prepare("SELECT COUNT(*) as result FROM `users_info` WHERE `superAdmin` = 1 AND `organisationId` = :organisationId");
        $isSuperAdminAndThereIsMoreThanOne->bindValue(':organisationId', $_SESSION["user"]->organisationId);
        $isSuperAdminAndThereIsMoreThanOne->execute();
        $output["isOneOfManySuperAdmins"] = $isSuperAdminAndThereIsMoreThanOne->fetchColumn(0) > 1;
    }
} catch (PDOException $e) {
    $output["errorTypes"][] = "queryError";
    $output["feedback"] = "There was an error querying the database; please try again. If the error persists please contact a system administrator for assistance.";
    $output["errorMessage"] = "There was an error querying the database; please try again. If the error persists please contact a system administrator for assistance.";
    $output["errorType"] = "queryError";
}

//echo json_encode(processResult($getAllUsers->fetchAll(PDO::FETCH_ASSOC), array("verified", "approved", "admin", "superAdmin")));
echo json_encode($output);
