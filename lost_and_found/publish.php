<?php
    error_reporting(E_ALL & ~E_NOTICE );
    //$_POST['publisher'] = '123';
    //$_POST['lostThing'] = '456';
    //$_POST['owner'] = '789';
    //$_POST['contactmethod'] = '102' ;

    $connect = new PDO("mysql:host=localhost;dbname=lost_and_found", 'root', '');
    if (!$connect) die("连接错误");

    $sql = "insert into `check`(publisher, lostThing, loser, contact, publishTime) VALUES (?,?,?,?,?)";
    $sth = $connect->prepare($sql);
    $result = $sth->execute(array($_POST['publisher'], $_POST['lostThing'], $_POST['owner'], $_POST['contactmethod'], date('Y-m-d H:i:s',time())));

    if ($result != '1'){
        $back = array('code' => '1');
        echo htmlspecialchars(json_encode($back));
    }
    else {
        $back = array('code' => '0');
        echo htmlspecialchars(json_encode($back));
    }