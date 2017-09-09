<?php
/*    $_POST['user']=123;
    $_POST['pw']=5456;*/
    error_reporting(E_ALL & ~E_NOTICE );
    header('Access-Control-Allow-Origin : * ');


    $connect = new PDO("mysql:host=localhost;dbname=danmaku", 'root', '');
    if (!$connect) die("连接错误");

    session_start();

    $sql = "select * from `user_center` where username = ? and password = ?";
    $sth = $connect->prepare($sql);
    $sth->execute(array($_POST['user'], $_POST['pw']));
    $result = $sth->fetch(PDO::FETCH_OBJ);

    if (empty($result)) {
        $back = array('code'=>1,'message'=>"用户名或密码错误！", 'sessionId'=>session_id());
        echo json_encode($back);
    }
    else {

        $sql = "update user_center set sessionId = ? where username = ?";
        $sth = $connect->prepare($sql);
        $sth->execute(array(session_id(),$_POST['user']));

        $_SESSION['user'] = $result->username;
        $_SESSION['id'] = $result->id;
        $_SESSION['isAdmin'] = $result->isAdmin;
        $_SESSION['isBanned']=$result->isBanned;


        $back = array('code' => 0, 'id' => $result->id, 'username' => $result->username, 'isAdmin' => $result->isAdmin, 'isBanned' => $result->isBanned, 'sessionId'=>session_id());
        echo json_encode($back);


    }
