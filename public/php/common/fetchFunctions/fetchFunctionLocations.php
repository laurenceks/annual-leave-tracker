<?php
function fetchFunctionLocations($organisationId) {
    require_once "../security/userLoginSecurityCheck.php";
    require "../common/db.php";
    $getAllLocations = $db->prepare("
        SELECT * FROM locations
        WHERE organisationId = :organisationId
        AND deleted = 0
        ");
    $getAllLocations->bindValue(':organisationId', $organisationId);
    $getAllLocations->execute();
    return $getAllLocations->fetchAll(PDO::FETCH_ASSOC);
}