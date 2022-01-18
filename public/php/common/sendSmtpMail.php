<?php

use PHPMailer\PHPMailer\PHPMailer;

function composeSmtpMail($email, $name, $subject, $message, $messageAlt) {
    require 'smtpCredentials.php';
    require 'appConfig.php';
    $emailFrom = "noreply@restocker.com";
    $emailFromName = $appName;
    $headers = "From: " . $appName . " <noreply@restocker.com>";
    $headers .= "Reply-To: noreply@restocker.com";
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/html; charset=ISO-8859-1\r\n";

    $mail = new PHPMailer;
    $mail->isSMTP();
    $mail->SMTPDebug = 0; // 0 = off (for production use) - 1 = client messages - 2 = client and server messages
    $mail->Host = "smtp.gmail.com"; // use $mail->Host = gethostbyname('smtp.gmail.com'); // if your network does not support SMTP over IPv6
    $mail->Port = 587; // TLS only
    $mail->SMTPSecure = 'tls'; // ssl is depracated
    $mail->SMTPAuth = true;
    $mail->Username = $smtpUsername;
    $mail->Password = $smtpPassword;
    $mail->setFrom($emailFrom, $emailFromName);
    $mail->addAddress($email, $name || "User");
    $mail->Subject = $subject;
    $mail->msgHTML($message); //$mail->msgHTML(file_get_contents('contents.html'), __DIR__); //Read an HTML message body from an external file, convert referenced images to embedded,
    $mail->AltBody = $messageAlt;

    return $mail;
}

function sendSmtpMail($mailToSend) {
    $smtpOutput = new stdClass();
    if (!$mailToSend) {
        $smtpOutput->status = "fail";
        $smtpOutput->success = false;
        $smtpOutput->response = $mailToSend["ErrorInfo"];
    } else {
        if (!$mailToSend->send()) {
            $smtpOutput->status = "fail";
            $smtpOutput->success = false;
            $smtpOutput->response = $mailToSend->ErrorInfo;
        } else {
            $smtpOutput->status = "success";
            $smtpOutput->success = true;
            $smtpOutput->response = "Message sent successfully";
        }

    }
    return $smtpOutput;
}