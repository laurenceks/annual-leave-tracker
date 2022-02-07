<?php
require "../security/userLoginSecurityCheck.php";
require "../common/db.php";
require "../common/feedbackTemplate.php";
require "../security/validateInputs.php";

$output = array_merge($feedbackTemplate, ["hours" => []]);
$input = validateInputs();

require "hoursQuery.php";

function makeArraySplit($row, $keyId, $keyName, $includeHours = true) {
    return array_merge([
        $keyId => $row[$keyId],
        $keyName => $row[$keyName]
    ], $includeHours ? [
        "hours" => $row["hours"],
        "approvedBookings" => $row["approvedBookings"]
    ] : []);
}

try {
    $getHours = $db->prepare($hoursByDateSplitQuery);

    $getHours->bindValue(':organisationId', $_SESSION["user"]->organisationId);
    $getHours->bindValue(':minDate', $input["from"]);
    $getHours->bindValue(':maxDate', $input["to"]);
    $getHours->bindValue(':interval', $input["dateGroup"]);
    $getHours->bindValue(':weekDayStart', $input["weekStart"]);
    $getHours->bindValue(':splitByPayGrade', $input["splitByPayGrade"]);
    $getHours->bindValue(':splitByLocation', $input["splitByLocation"]);
    $getHours->bindValue(':groupSplitBy', $input["groupSplitBy"]);
    $getHours->execute();

    if ($input["splitByLocation"] || $input["splitByPayGrade"]) {
        $secondSplit = $input["splitByPayGrade"] && $input["splitByLocation"];
        $splitKeyId = $secondSplit ? $input["groupSplitBy"] : ($input["splitByLocation"] ? "locationId" : "payGradeId");
        $splitKeyName = $splitKeyId === "locationId" ? "locationName" : "payGradeName";
        $altKeyId = $splitKeyId === "locationId" ? "payGradeId" : "locationId";
        $altKeyName = $splitKeyId === "locationId" ? "payGradeName" : "locationName";
        $previousRow = ["date" => null, $splitKeyId => null];
        $output["hoursRaw"] = $getHours->fetchAll(PDO::FETCH_ASSOC);

        foreach ($getHours as $row) {
            if ($previousRow["date"] === $row["date"]) {
                $lastRowIndex = count($output["hours"]) - 1;
                if ($secondSplit) {
                    $lastSplitIndex = isset($output["hours"][$lastRowIndex]["subGroup"]) ? (count($output["hours"][$lastRowIndex]["subGroup"]) - 1) : 0;
                    if ($previousRow[$splitKeyId] === $row[$splitKeyId]) {
                        $output["hours"][$lastRowIndex]["subGroup"][$lastSplitIndex]["subGroup"][] = makeArraySplit($row, $altKeyId, $altKeyName);
                    } else {
                        $output["hours"][$lastRowIndex]["subGroup"][] = array_merge(makeArraySplit($row, $splitKeyId, $splitKeyName, false), [
                            "subGroup" => [makeArraySplit($row, $altKeyId, $altKeyName)]
                        ]);
                    }
                } else {
                    $output["hours"][$lastRowIndex]["subGroup"][] = makeArraySplit($row, $splitKeyId, $splitKeyName);
                }
            } else {
                $output["hours"][] = [
                    "date" => $row["date"],
                    "subGroup" => [
                        array_merge(makeArraySplit($row, $splitKeyId, $splitKeyName, !$secondSplit), $secondSplit ? [
                            "subGroup" => [makeArraySplit($row, $altKeyId, $altKeyName)]
                        ] : [])
                    ]
                ];
            }
            $previousRow = $row;
        }
    } else {
        $output["hours"] = $getHours->fetchAll(PDO::FETCH_ASSOC);
    }

    $output["success"] = true;
    $output["title"] = "Hours updated";
    $output["feedback"] = "Now showing approved hours for " . date("d/m/Y", strtotime($input["from"])) . " to " . date("d/m/Y", strtotime($input["to"])) . ($input["dateGroup"] === "day" ? "" : " broken down by " . $input["dateGroup"] . ($input["dateGroup"] === "week" ? " (starting on " . jddayofweek($input["weekStart"], 1) . ")" : ""));
    if ($input["splitByLocation"] || $input["splitByPayGrade"]) {
        $output["feedback"] .= $input["dateGroup"] === "day" ? " broken down by " : ", ";
        if ($input["splitByLocation"] && $input["splitByPayGrade"]) {
            $output["feedback"] .= $input["groupSplitBy"] === "locationId" ? "location, pay grade" : "pay grade, location";
        } else {
            $output["feedback"] .= $input["splitByLocation"] ? "location" : "pay grade";
        }
    }
} catch (PDOException $e) {
    $output = array_merge($output, array(
        "feedback" => "There was an error querying the database; please try again. If the error persists please contact a system administrator for assistance.",
        "errorMessage" => "There was an error querying the database; please try again. If the error persists please contact a system administrator for assistance.",
        "errorType" => "queryError"
    ));
}
echo json_encode($output);
