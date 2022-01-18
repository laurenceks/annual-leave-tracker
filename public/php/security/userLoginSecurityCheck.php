<?php
require '../vendor/autoload.php';
require 'endProcessDueToInvalidLogin.php';

use Delight\Auth\Auth;

require_once "../common/db.php";
$auth = new Auth($db);

if (!$auth->isLoggedIn()) {
    endProcessDueToInvalidLogin("User not logged in");
} else {
    $msg = "User login invalid";
    $uid = $auth->getUserId();
    $loginSecondaryChecks = $db->prepare("SELECT users.verified, users_info.approved, users_info.suspended, users_info.organisationId FROM users LEFT JOIN users_info ON users.id = users_info.userId WHERE userId = :userId");
    $loginSecondaryChecks->bindParam(":userId", $uid);
    $loginSecondaryChecks->execute();
    $u = $loginSecondaryChecks->fetch(PDO::FETCH_OBJ);
    if (!$u->verified || !$u->approved || $u->suspended || $u->organisationId !== $_SESSION["user"]->organisationId) {
        if ($u->suspended) {
            $msg = "User has been suspended";
        } else if (!$u->approved) {
            $msg = "User is not approved";
        } else if (!$u->verified) {
            $msg = "User is not verified";
        } else if ($u->organisationId !== $_SESSION["user"]->organisationId) {
            $msg = "User does not belong to current organisation";
        }
        endProcessDueToInvalidLogin($msg);
    }
}