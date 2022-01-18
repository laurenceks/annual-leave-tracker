<?php
require "../security/userLoginSecurityCheck.php";
require "../common/db.php";
require "../common/feedbackTemplate.php";

$output = array_merge($feedbackTemplate, array("payGrades" => array()));
$input = json_decode(file_get_contents('php://input'), true);
$getAllPayGrades = $db->prepare("
SELECT *
FROM 
  pay_grades 
WHERE 
  organisationId = :organisationId;");

$getAllPayGrades->bindValue(':organisationId', $_SESSION["user"]->organisationId);
$getAllPayGrades->execute();
$output["payGrades"] = $getAllPayGrades->fetchAll(PDO::FETCH_ASSOC);
$output["success"] = true;
$output["title"] = "Pay grades updated";
$output["feedback"] = "Pay grades data has been refreshed";

echo json_encode($output);
