<?php
    error_reporting(E_ALL & ~E_NOTICE);

    $_POST['user']=123;
    $_POST['pw']=5456;

    $connect = new PDO("mysql:host=localhost;dbname=danmaku", 'root', '');
    if (!$connect) die("连接错误");

    $sql = "select * from `user_center` where username = ? and password = ?";
    $sth = $connect->prepare($sql);
    $sth->execute(array($_POST['user'], $_POST['pw']));
    $res = $sth->fetch(PDO::FETCH_OBJ);

    echo $res->id;
    echo $res->password;