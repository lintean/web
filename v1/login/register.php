<?php
/*    $_POST['user']=1234;
    $_POST['pw']=5456;*/

    error_reporting(E_ALL & ~E_NOTICE );
    header('Access-Control-Allow-Origin : * ');
    session_start();

    $connect = new PDO("mysql:host=localhost;dbname=danmaku", 'root', '');
    if (!$connect) die("连接错误");

    $sql = "select * from `user_center` where username = ?";
    $sth = $connect->prepare($sql);
    $sth->execute(array($_POST['user']));
    $result = $sth->fetch(PDO::FETCH_OBJ);

    if (empty($result)){
        $sql = "insert into user_center(username,password) VALUES (?,?)";
        $sth = $connect->prepare($sql);
        $sth->execute(array($_POST['user'], $_POST['pw']));

        $sql = "select * from `user_center` where username = ?";
        $sth = $connect->prepare($sql);
        $sth->execute(array($_POST['user']));
        $result = $sth->fetch(PDO::FETCH_OBJ);

        $_SESSION['user']=$_POST['user'];
        $_SESSION['id']=$_POST['id'];
        $_SESSION['isAdmin']=$result->isAdmin;
        $_SESSION['isBanned']=$result->isBanned;

        $sql = "update user_center set sessionId = ? where username = ?";
        $sth = $connect->prepare($sql);
        $sth->execute(array(session_id(),$result->username));

        $back = array('code' => 0, 'id' => $result->id, 'username' => $result->username, 'isAdmin' => $result->isAdmin, 'isBanned' => $result->isBanned, 'sessionId'=>session_id());
        echo json_encode($back);
    }
    else {
        $back = array('code' => 1, 'message' => "用户名已存在！", 'sessionId'=>session_id());
        echo json_encode($back);
    }