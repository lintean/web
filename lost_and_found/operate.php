<?php
    error_reporting(E_ALL & ~E_NOTICE );
    session_start();
    $connect = new PDO("mysql:host=localhost;dbname=lost_and_found", 'root', '');
    if (!$connect) die("连接错误");

    //$_SESSION['id'] = '123';
    //$_POST['operation'] = 'delete';
    //$_POST['id'] = '3';

    if (isset($_SESSION['id'])) {

        if ($_POST['operation'] == 'delete'){
            $sql="delete from `check` where id = ?";
            $sth = $connect->prepare($sql);
            $result = $sth->execute(array($_POST['id']));

            if ($result == '1') {
                $back = array('code' => '0');
                echo htmlspecialchars(json_encode($back));
            }
            else out();
        }
        if ($_POST['operation'] == 'pass'){
            $sql = "select * from `check` where id = ?";
            $sth = $connect->prepare($sql);
            $sth->execute(array($_POST['id']));
            $result = $sth->fetch(PDO::FETCH_OBJ);

            if (empty($result)) out();

            $sql = "insert into `list`(publisher, lostThing, loser, contact, publishTime) VALUES (?,?,?,?,?)";
            $sth = $connect->prepare($sql);
            $result = $sth->execute(array($result->publisher, $result->lostThing, $result->loser, $result->contact, $result->publishTime));

            if ($result != '1') out();

            $sql="delete from `check` where id = ?";
            $sth = $connect->prepare($sql);
            $result = $sth->execute(array($_POST['id']));

            if ($result == '1') {
                $back = array('code' => '0');
                echo htmlspecialchars(json_encode($back));
            }
            else out();
        }
    }
    else {
        out();
    }

    function out(){
        $back = array('code' => '1');
        echo htmlspecialchars(json_encode($back));
        exit();
    }