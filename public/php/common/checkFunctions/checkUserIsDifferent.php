<?php
function checkUserIsDifferent($id) {
    require_once dirname(__FILE__) . "/../../security/userLoginSecurityCheck.php";
    require dirname(__FILE__) . "/../../common/db.php";

    //default - assume current user is same as target

    $result = true;

    try {
        $check = $db->prepare("SELECT `userId` FROM `bookings` WHERE `id` = :id AND `organisationId` = :organisationId AND `userId` = :userId");
        $check->bindValue(":id", $id);
        $check->bindValue(":organisationId", $_SESSION["user"]->organisationId);
        $check->bindValue(":userId", $_SESSION["user"]->userId);
        $check->execute();
        $response = $check->fetchAll(PDO::FETCH_ASSOC);
        //return TRUE if any results (i.e. current user is the same as the userId)
        $result = count($response) > 0;
    } catch (PDOException $e) {
        //error
        $result = false;
    }

    return $result;
}