<?php
function endProcessDueToInvalidLogin($msg)
{
    //user not logged in or login status invalid - proceed no further
    require "../login/logout.php";
    echo json_encode(array("failedLoginCheck" => true, "errorMessage" => $msg));
    die();
}

