<?php
function getUserInfo($userId, $auth = null) {
    if ($userId) {
        require "db.php";
        $getUserInfo = $db->prepare("
        SELECT users.email, users_info.*, users_info.userId as id, users_organisations.organisation
        FROM users
        LEFT JOIN users_info ON users.id = users_info.userId
        LEFT JOIN users_organisations ON users_info.organisationId = users_organisations.id
        WHERE users.id = :userId
        ");
        $getUserInfo->bindParam(':userId', $userId);
        $getUserInfo->execute();

        //TODO if user deleted whilst logged in handle
        $output = $getUserInfo->fetch(PDO::FETCH_OBJ);
        $output->roles = $auth ? array_values($auth->getRoles()) : null;
        return $output;
    } else {
        return false;
    }
}
