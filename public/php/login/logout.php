<?php
require '../vendor/autoload.php';

use Delight\Auth\Auth;

require "../common/db.php";

$auth = new Auth($db);
try {
    $auth->logOutEverywhere();
} catch (\Delight\Auth\NotLoggedInException $e) {
    //User wasn't logged in - doesn't matter
}
$auth->destroySession();