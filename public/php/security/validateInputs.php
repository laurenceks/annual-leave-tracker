<?php
function validateInputs($trimInput = true) {

    //TODO find a way to validate array contents

    $rawInputs = json_decode(file_get_contents('php://input'), true);
    if ($rawInputs && count($rawInputs) > 0) {
        function exitDueToInvalidInput($key, $val) {
            die(json_encode([
                "success" => false,
                "title" => "Invalid inputs",
                "feedback" => "Some of the inputs passed could not be validated " . $key . " " . $val,
                "errorMessage" => "Unable to validate input '" . ($key || "") . "'",
                "errorType" => "invalidInput"
            ]));
        }

        $validatedInputs = ["rawInputs" => $rawInputs];
        $expressions = [
            "string" => ["options" => ["regexp" => "/^$|[\s\S]*/"]],
            "date" => ["options" => ["regexp" => "/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/"]],
            "password" => ["options" => ["regexp" => "/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/"]]
        ];

        $inputTypes = [
            "userId" => FILTER_VALIDATE_INT,
            "maskedEmail" => "string",
            "maskedFirstName" => "string",
            "maskedLastName" => "string",
            "inputAccountFirstName" => "string",
            "inputAccountLastName" => "string",
            "firstName" => "string",
            "inputAccountOldPassword" => "password",
            "inputAccountNewPassword1" => "password",
            "periodId" => FILTER_VALIDATE_INT,
            "hours" => FILTER_VALIDATE_FLOAT,
            "userFullName" => "string",
            "periodName" => "string",
            "id" => FILTER_VALIDATE_INT,
            "name" => "string",
            "allowanceId" => FILTER_VALIDATE_INT,
            "inputAddBookingFrom" => "date",
            "inputAddBookingTo" => "date",
            "inputAddBookingHours" => FILTER_VALIDATE_FLOAT,
            "inputAddBookingUserComments" => "string",
            "from" => "date",
            "to" => "date",
            "userComments" => "string",
            "dateFrom" => "date",
            "dateTo" => "date",
            "period" => "array",
            "inputAddLocationName" => "string",
            "inputLoginRemember" => FILTER_VALIDATE_BOOL,
            "inputLoginEmail" => FILTER_VALIDATE_EMAIL,
            "inputLoginPassword" => "password",
            "inputRegisterEmail" => FILTER_VALIDATE_EMAIL,
            "inputRegisterFirstName" => "string",
            "inputRegisterLastName" => "string",
            "inputRegisterOrganisation" => "string",
            "inputRegisterLocation" => "string",
            "inputRegisterPayGrade" => "string",
            "inputRegisterPassword" => "password",
            "inputRegisterConfirmPassword" => "password",
            "organisation" => "array",
            "location" => "array",
            "payGrade" => "array",
            "inputForgotEmail" => FILTER_VALIDATE_EMAIL,
            "inputReVerifyEmail" => FILTER_VALIDATE_EMAIL,
            "inputAddPayGradeName" => "string",
            "inputAddPeriodName" => "string",
            "inputAddPeriodFrom" => "date",
            "inputAddPeriodTo" => "date",
            "status" => "string",
            "managerComments" => "string",
            "feedbackVerb" => "string",
            "staffFullName" => "string",
            "locationId" => FILTER_VALIDATE_INT,
            "payGradeId" => FILTER_VALIDATE_INT,
            "weekStart" => FILTER_VALIDATE_INT,
            "splitByLocation" => FILTER_VALIDATE_BOOL,
            "splitByPayGrade" => FILTER_VALIDATE_BOOL,
            "dateGroup" => "string",
            "groupSplitBy" => "string",
        ];

        foreach ($rawInputs as $key => $value) {
            if (isset($value) && isset($inputTypes[$key])) {
                $value = ($trimInput && $inputTypes[$key] === "string") ? trim($value) : $value;
                if ($value === "" && $inputTypes[$key] === "string") {
                    $valueIsValid = gettype(value) === "string";
                } else if (gettype($inputTypes[$key]) === "string") {
                    $value = $inputTypes[$key] === "array" ? is_array($value) : filter_var($value, FILTER_VALIDATE_REGEXP, $expressions[$inputTypes[$key]]);
                    $valueIsValid = $value !== false;
                } else if ($inputTypes[$key] === FILTER_VALIDATE_BOOL) {
                    $valueIsValid = true;
                    $value = filter_var($value, FILTER_VALIDATE_BOOL);
                } else {
                    $valueIsValid = filter_var($value, $inputTypes[$key]) !== false;
                }
                if ($valueIsValid) {
                    $validatedInputs[$key] = $value;
                } else {
                    exitDueToInvalidInput($key, $value);
                }
            }
        }

        return $validatedInputs;

    } else {
        die(json_encode([
            "success" => false,
            "title" => "No inputs",
            "feedback" => "No inputs were passed to the validation function",
            "errorMessage" => "No inputs were passed to the validation function",
            "errorType" => "noInputs"
        ]));
    }
}