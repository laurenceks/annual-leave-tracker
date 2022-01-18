<?php
require '../vendor/autoload.php';

use Delight\Auth\Auth;
use Delight\Auth\Role;

require_once "../common/db.php";
$auth = new Auth($db);

if (!($auth->hasRole(Role::ADMIN) || $auth->hasRole(Role::SUPER_ADMIN))) {
    //user does not have admin rights - proceed no further
    echo json_encode(array("failedLoginCheck" => true, "errorMessage" => "User does not have admin rights"));
    die();
}