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

        foreach ($getHours as $row) {
            if ($previousRow["date"] === $row["date"]) {
                $lastRowIndex = count($output["hours"]) - 1;
                if ($secondSplit) {
                    $lastSplitIndex = isset($output["hours"][$lastRowIndex]["split"]) ? (count($output["hours"][$lastRowIndex]["split"]) - 1) : 0;
                    if ($previousRow[$splitKeyId] === $row[$splitKeyId]) {
                        $output["hours"][$lastRowIndex]["split"][$lastSplitIndex]["split"][] = makeArraySplit($row, $altKeyId, $altKeyName);
                    } else {
                        $output["hours"][$lastRowIndex]["split"][] = array_merge(makeArraySplit($row, $splitKeyId, $splitKeyName, false), [
                            "split" => [makeArraySplit($row, $altKeyId, $altKeyName)]
                        ]);
                    }
                } else {
                    $output["hours"][$lastRowIndex]["split"][] = makeArraySplit($row, $splitKeyId, $splitKeyName);
                }
            } else {
                $output["hours"][] = [
                    "date" => $row["date"],
                    "split" => [
                        array_merge(makeArraySplit($row, $splitKeyId, $splitKeyName, !$secondSplit), $secondSplit ? [
                            "split" => [makeArraySplit($row, $altKeyId, $altKeyName)]
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
    $output["feedback"] = "Now showing data for the period XXXX";
} catch (PDOException $e) {
    $output = array_merge($output, array(
        "feedback" => "There was an error querying the database; please try again. If the error persists please contact a system administrator for assistance.",
        "errorMessage" => "There was an error querying the database; please try again. If the error persists please contact a system administrator for assistance.",
        "errorType" => "queryError"
    ));
}
echo json_encode($output);
