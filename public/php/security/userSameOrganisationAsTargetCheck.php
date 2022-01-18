<?php

function targetHasSameOrganisationAsCurrentUser($id)
{
    require "../common/db.php";
    $id = $id ? intval($id) : null;
    if ($id && is_numeric($id)) {
        $targetIdSameOrganisationChecks = $db->prepare("SELECT users_info.organisationId FROM users_info WHERE userId = :userId");
        $targetIdSameOrganisationChecks->bindParam(":userId", $id);
        $targetIdSameOrganisationChecks->execute();
        if (!($targetIdSameOrganisationChecks->fetch(PDO::FETCH_OBJ)->organisationId === $_SESSION["user"]->organisationId)) {
            endProcessDueToInvalidLogin("Target user and current user are not in the same organisation");
        }
    } else {
        endProcessDueToInvalidLogin("Unable to complete security check - invalid id passed");
    }
}