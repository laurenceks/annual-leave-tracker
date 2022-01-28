<?php
function checkDatesOverlap($table, $from, $to, $includeDeleted = false, $userId = null, $entryId = null) {
    require_once dirname(__FILE__) . "/../../security/userLoginSecurityCheck.php";
    require dirname(__FILE__) . "/../../common/db.php";

    //returns true if dates overlap - default is to assume overlap and return true
    $response = true;
    $whiteList = array("tables" => array("bookings", "periods"));

    if (in_array($table, $whiteList["tables"], true)) {
        try {
            $check = $db->prepare("SELECT id, dateFrom, dateTo FROM " . $table . " WHERE organisationId = :organisationId AND ((dateFrom >= :dateFrom1 AND dateFrom <= :dateTo1) OR (dateTo >= :dateFrom2 AND dateTo <= :dateTo2) OR (dateFrom <= :dateFrom3 AND dateTo >= :dateTo3))" . ($includeDeleted ? "" : " AND deleted = 0") . ($entryId ? " AND id != :id" : "") . (($userId && $table === "bookings") ? " AND userId = :userId" : "") . " ORDER BY dateFrom");
            $check->bindValue(':organisationId', $_SESSION["user"]->organisationId);
            $check->bindValue(':dateFrom1', $from);
            $check->bindValue(':dateFrom2', $from);
            $check->bindValue(':dateFrom3', $from);
            $check->bindValue(':dateTo1', $to);
            $check->bindValue(':dateTo2', $to);
            $check->bindValue(':dateTo3', $to);
            if ($entryId) {
                $check->bindValue(":id", $entryId);
            }
            if ($userId) {
                $check->bindValue(":userId", $userId);
            }
            $check->execute();
            $response = $check->fetchAll(PDO::FETCH_ASSOC);
            $response = count($response) > 0;
        } catch (PDOException $e) {
            $response = true;
        }
    }
    return $response;
}