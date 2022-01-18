<?php
function fetchFunctionLists($organisationId, $locationId = null) {
    require_once "../security/userLoginSecurityCheck.php";
    require "../common/db.php";
    $locationWhere = $locationId ? "AND transactions.locationId = :locationId" : "";
    $getAllLists = $db->prepare("SELECT 
  'all' as locationId, 
  'all' as locationName, 
  lists.id, 
  lists.name as listName, 
  items.id as itemId,
       list_items.id as listItemsId,
  list_items.quantity,
  items.name as itemName, 
  items.unit, 
  items.warningLevel, 
  items.currentStock 
FROM 
  locations, 
  lists 
  LEFT JOIN list_items on list_items.listId = lists.id 
  LEFT JOIN items ON items.id = list_items.itemId 
WHERE 
  locations.organisationId = :organisationId1
  AND locations.deleted = 0 
  AND lists.organisationId = :organisationId2
  AND lists.deleted = 0 
UNION 
SELECT 
  locations.id as locationId, 
  locations.name as locationName, 
  lists.id, 
  lists.name as listName, 
  items.id as itemId,
       list_items.id as listItemsId,
  list_items.quantity,
  items.name as itemName, 
  items.unit, 
  items.warningLevel, 
  (
    SELECT 
      SUM(transactions.quantity) 
    FROM 
      transactions 
    WHERE 
      transactions.itemId = list_items.itemId 
      AND locations.id = transactions.locationId 
      AND transactions.organisationId = :organisationId3
  ) AS currentStock 
FROM 
  locations, 
  lists 
  LEFT JOIN list_items on list_items.listId = lists.id 
  LEFT JOIN items ON items.id = list_items.itemId 
WHERE 
  locations.organisationId = :organisationId4
  AND locations.deleted = 0 
  AND lists.organisationId = :organisationId5
  AND lists.deleted = 0;
");
    /*    $getAllLists = $db->prepare("SELECT
        'all' as locationId,
        lists.id,
        lists.name AS listName,
        listitems.itemId,
        listitems.quantity,
        items.name,
        items.currentStock,
        items.warningLevel
        FROM lists
        LEFT JOIN listItems ON lists.id = listitems.listId
        LEFT JOIN items ON items.id = listitems.itemId
        LEFT JOIN transactions ON transactions.itemId = listitems.itemId
        WHERE lists.organisationId = :organisationId1 AND lists.deleted = 0 AND transactions.organisationId = :organisationId2
        GROUP BY lists.id, items.id

        UNION

        SELECT
        transactions.locationId as locationId,
        lists.id,
        lists.name AS listName,
        listitems.itemId,
        listitems.quantity,
        items.name,
        CAST(SUM(transactions.quantity) AS INT) AS currentStock,
        items.warningLevel
        FROM lists
        LEFT JOIN listItems ON lists.id = listitems.listId
        LEFT JOIN items ON items.id = listitems.itemId
        LEFT JOIN transactions ON transactions.itemId = listitems.itemId
        WHERE lists.organisationId = :organisationId3 AND lists.deleted = 0 AND transactions.organisationId = :organisationId4
        GROUP BY transactions.locationId, lists.id, items.id;");*/

    $getAllLists->bindValue(':organisationId1', $organisationId);
    $getAllLists->bindValue(':organisationId2', $organisationId);
    $getAllLists->bindValue(':organisationId3', $organisationId);
    $getAllLists->bindValue(':organisationId4', $organisationId);
    $getAllLists->bindValue(':organisationId5', $organisationId);
    $getAllLists->execute();
    if ($locationId) {
        $getAllLists->bindValue(':locationId', $locationId);
    }

    return $getAllLists->fetchAll(PDO::FETCH_ASSOC);
}