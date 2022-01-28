<?php
function checkFunctionExists($table, $selectKey, $keyValues, $includeDeleted = false, $compareValues = false, $entryId = null) {
    require_once "../../security/userLoginSecurityCheck.php";
    require "../../common/db.php";

    $result = false;
    $whiteList = array("tables" => array("bookings", "allowances", "periods", "locations", "pay_grades", "users_info"), "keys" => array("id", "name", "listId", "itemId", "userId"));

    if (count($keyValues) > 0 && in_array($table, $whiteList["tables"], true) && in_array($selectKey, $whiteList["keys"], true)) {
        $whereString = " WHERE";
        $i = 1;
        $j = 0;
        $k = 1;
        foreach ($keyValues as $pair) {
            if (in_array($pair["key"], $whiteList["keys"], true)) {
                $whereString .= ($j === 0 ? " " : " AND ") . $pair["key"] . " = :value" . $i;
                $j++;
            }
            $i++;
        }

        if ($j > 0) {
            $check = $db->prepare("SELECT " . $selectKey . " FROM " . $table . $whereString . ($includeDeleted ? "" : " AND deleted = 0") . ($entryId ? " AND id != :id" : ""));
            foreach ($keyValues as $pair) {
                $check->bindValue(':value' . $k, $pair["value"]);
                $k++;
            }
            if ($entryId) {
                $check->bindValue(":id", $entryId);
            }
            $check->execute();
            $response = $check->fetchAll(PDO::FETCH_ASSOC);
            //TODO loop and compare all key-value pairs
            $result = ($compareValues && isset($response[0])) ? $response[0][$keyValues[0]["key"]] === $keyValues[0]["value"] : count($response) > 0;
        }
    }

    return $result;
}