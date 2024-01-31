<?php
    ini_set( 'display_errors', 1 );
    error_reporting( E_ALL );
    $from =  $_POST['from'];
    $cc = $_POST['cc_email'];
    $to =  $_POST['email_to'];
    $subject = $_POST['subject'];
    $message = $_POST['message'];
    // É necessário indicar que o formato do e-mail é html
    $headers  = 'MIME-Version: 1.0' . "\r\n";
    $headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";
    $headers .= 'From: '. $from;
    $headers .= 'Cc: '.$cc;
    $enviaremail = mail($to,$subject,$message, $headers);
    if($enviaremail){
      echo "OK";
    } else {
      $mgm = "FAIL SENDER MAIL!";
      echo $mgm;
    }
?>
