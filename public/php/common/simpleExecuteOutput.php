<?php
function simpleExecuteOutput($exe, $output = array()) {
    require "../common/feedbackTemplate.php";
    $output = array_merge($feedbackTemplate, $output, array("errorCode" => null));
    try {
        $exe->execute();
        $output["success"] = true;
        $output["title"] = $output["title"] === "Error" ? "Operation complete" : $output["title"];
        $output["feedback"] = $output["feedback"] === "An unknown error occurred" ? "The operation was completed successfully" : $output["feedback"];
    } catch (PDOException $e) {
        $output["feedback"] = "There was an error querying the database; please try again. If the error persists please contact a system administrator for assistance.";
        $output["errorMessage"] = "There was an error querying the database; please try again. If the error persists please contact a system administrator for assistance.";
        $output["errorTypes"][] = "queryError";
        $output["errorType"] = "queryError";
    }
    return $output;
}