<?php
function composeForgotEmail($selector, $token, $name = null) {
    require "../../common/appConfig.php";
    $serverString = ($_SERVER['SERVER_NAME'] == "localhost" ? "http://" : "https://") . $_SERVER['SERVER_NAME'] . ($_SERVER['SERVER_NAME'] == "localhost" ? ":3000/#" : "");
    $url = $serverString . '/resetPassword?selector=' . urlencode($selector) . '&token=' . urlencode($token);
    $messageAlt = "Please copy and paste the below link into your browser to recover your " . $appName . " account.\n\r\n\r" . $url;
    $message = file_get_contents('forgotHTMLTemplate.html', __DIR__);
    $message = mb_convert_encoding($message, 'HTML-ENTITIES', "UTF-8");
    $message = str_replace("%URL%", $url, $message);
    if ($name) {
        $message = str_replace("%USER%", $name, $message);
    } else {
        $message = str_replace(", %USER%", "", $message);
    }

    return array("serverString" => $serverString, "url" => $url, "messageAlt" => $messageAlt, "message" => $message);
}