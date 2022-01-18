<?php
function fetchFunctionItems($organisationId, $locationId = null) {
    require_once "../security/userLoginSecurityCheck.php";
    require "../common/db.php";
    $locationWhere = $locationId ? "AND transactions.locationId = :locationId" : "";
    $getAllItems = $db->prepare('SELECT items.id,
                                   items.name,
                                   items.unit,
                                   "all" AS locationId,
                                items.currentStock,
                                   items.warningLevel
                            FROM   items
                            WHERE items.deleted = 0
                            AND items.organisationId = :organisationId1
                            GROUP  BY items.id
                            UNION
                            SELECT items.id,
                                   items.name,
                                   items.unit,
                                   transactions.locationid,
                                   CAST(SUM(quantity) AS SIGNED) AS currentStock,
                                   items.warningLevel
                            FROM   `items`
                                   LEFT JOIN transactions
                                          ON items.id = transactions.itemid
                            WHERE  items.deleted = 0
                                AND items.organisationid = :organisationId2
                                   AND transactions.organisationid = :organisationId3' . "\n" . $locationWhere . "\n" . 'GROUP  BY items.id,
                                      transactions.locationId
                            ORDER  BY locationId,
                                      id; ');
    $getAllItems->bindValue(':organisationId1', $organisationId);
    $getAllItems->bindValue(':organisationId2', $organisationId);
    $getAllItems->bindValue(':organisationId3', $organisationId);
    if ($locationId) {
        $getAllItems->bindValue(':locationId', $locationId);
    }
    $getAllItems->execute();
    return $getAllItems->fetchAll(PDO::FETCH_ASSOC);
}