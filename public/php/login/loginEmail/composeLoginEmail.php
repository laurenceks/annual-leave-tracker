<?php
function composeLoginEmail($emailProps) {
    $serverString = $_SERVER['SERVER_NAME'] === "localhost" ? "http://192.168.0.60:3000/#" : ("https://" . $_SERVER['SERVER_NAME'] ."/demos/restocker/#");
    $messageAlt = ($emailProps["alt"] || "") . ($emailProps["url"] || "");
    $message = file_get_contents('loginEmailTemplate.html', __DIR__);
    $message = mb_convert_encoding($message, 'HTML-ENTITIES', "UTF-8");
    if (isset($emailProps["url"])) {
        $emailProps["url"] = $serverString . $emailProps["url"];
    }
    $parts = array("headline", "subheadline", "body", "buttonText", "url");

    foreach ($parts as $part) {
        $message = str_replace("%" . strtoupper($part) . "%", isset($emailProps[$part]) ? $emailProps[$part] : "", $message);
    }

    return array("serverString" => $serverString, "url" => $emailProps["url"] || null, "messageAlt" => $messageAlt, "message" => $message);
}