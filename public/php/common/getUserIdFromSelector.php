<?php
function getUserIdFromSelector($selector, $table) {
    if (!$selector || !$table) {
        return null;
    } else {
        require "db.php";
        try {
            $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $userField = $table == "users_confirmations" ? "user_id" : "user";
            $getUserId = $db->prepare("SELECT $userField FROM $table WHERE `selector`=:selector");
            $getUserId->bindParam(':selector', $selector);
            $getUserId->execute();
            $getUserId = $getUserId->fetch(PDO::FETCH_ASSOC);
            return $getUserId ? $getUserId[$userField] : false;
        } catch (PDOException $e) {
            return $e;
        }
    }
}
