<?php
require '../vendor/autoload.php';

use Delight\Auth\Auth;

require_once "../common/db.php";
$auth = new Auth($db);

$output = array("isLoggedIn" => $auth->isLoggedIn(), "user" => null);

if ($output["isLoggedIn"]) {
    require "../common/getUserInfo.php";
    $output["user"] = getUserInfo($auth->getUserId());
}

echo json_encode($output);