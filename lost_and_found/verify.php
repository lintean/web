<?php
    error_reporting(E_ALL & ~E_NOTICE );
    session_start();
    $connect = new PDO("mysql:host=localhost;dbname=lost_and_found", 'root', '');
    if (!$connect) die("连接错误");

    //$_POST['username'] = '123';
    //$_POST['password'] = '111111';

    $sql = "select * from `manager` where username = ? and password = ?";
    $sth = $connect->prepare($sql);
    $sth->execute(array($_POST['username'], $_POST['password']));
    $result = $sth->fetch(PDO::FETCH_OBJ);

    if (empty($result)){
        $back = array('code' => '1');
        echo htmlspecialchars(json_encode($back));
    }
    else {
        $_SESSION['id'] = $result->id;
        $back = array('code' => '0');
        echo htmlspecialchars(json_encode($back));
    }