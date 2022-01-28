<?php
function checkDatesDontOverlap($table, $from, $to, $includeDeleted = false, $userId = null, $entryId = null) {
    require_once "../security/userLoginSecurityCheck.php";
    require "../common/db.php";

    //default is to return true (prevents code assuming no overlap)
    $result = true;
    $whiteList = array("tables" => array("bookings", "allowances", "periods", "locations", "pay_grades", "users_info"), "keys" => array("id", "name", "listId", "itemId", "userId"));

    if (count($keyValues) > 0 && in_array($table, $whiteList["tables"], true) && in_array($selectKey, $whiteList["keys"], true)) {
        $check = $db->prepare("SELECT id, dateFrom, dateTo FROM " . $table . " WHERE organisationId = :organisationId AND ((dateFrom >= :dateFrom1 AND dateFrom <= :dateTo1) OR (dateTo >= :dateFrom2 AND dateTo <= :dateTo2) OR (dateFrom <= :dateFrom3 AND dateTo >= :dateTo3))" . ($includeDeleted ? "" : " AND deleted = 0") . ($entryId ? " AND id != :id" : "") . (($userId && $table === "bookings") ? " AND userId = :userId" : "") . " ORDER BY dateFrom");
        $getAllBookings->bindValue(':organisationId', $_SESSION["user"]->organisationId);
        $getAllBookings->bindValue(':dateFrom1', $from);
        $getAllBookings->bindValue(':dateFrom2', $from);
        $getAllBookings->bindValue(':dateFrom3', $from);
        $getAllBookings->bindValue(':dateTo1', $to);
        $getAllBookings->bindValue(':dateTo2', $to);
        $getAllBookings->bindValue(':dateTo3', $to);
        if ($entryId) {
            $check->bindValue(":id", $entryId);
        }
        if ($entryId) {
            $check->bindValue(":userId", $userId);
        }
        $check->execute();
        $response = $check->fetchAll(PDO::FETCH_ASSOC);
        $response = count($response) > 0;
    }

    return $result;
}