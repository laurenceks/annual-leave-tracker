<?php
require_once "../common/db.php";
echo json_encode($db->query("SELECT * FROM users_organisations")->fetchAll(PDO::FETCH_ASSOC));