<?php
require "dbCredentials.php";
try {
    $db = new PDO("mysql:host=$dbServer;dbname=$dbName", $dbUser, $dbPass);
    // set the PDO error mode to exception
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    //make sure retrieved numbers and null aren't converted to strings
    $db->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
    $db->setAttribute(PDO::ATTR_STRINGIFY_FETCHES, false);
} catch (PDOException $e) {
    $output["feedback"] = "There was an error querying the database; please try again. If the error persists please contact a system administrator for assistance.";
    $output["errorMessage"] = "There was an error querying the database; please try again. If the error persists please contact a system administrator for assistance.";
    $output["errorTypes"][] = "connectionError";
    $output["errorType"] = "connectionError";
    echo $output;
}