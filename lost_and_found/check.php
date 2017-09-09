<?php
    error_reporting(E_ALL & ~E_NOTICE );
    session_start();
    $connect = new PDO("mysql:host=localhost;dbname=lost_and_found", 'root', '');
    if (!$connect) die("连接错误");

    //$_SESSION['id'] = '123';

    if (isset($_SESSION['id'])) {
        $sql = "select * from `check`";
        $sth = $connect->prepare($sql);
        $sth->execute();
        $result = $sth->fetchAll(PDO::FETCH_ASSOC);

        if (empty($result)) {
            $back = array('code'=> '1');
            echo htmlspecialchars(json_encode($back));
        }
        else {
            $i = 2;
            $back[0] = array('code' => '0');
            $back[1] = array('id' => $_SESSION['id']);
            foreach($result as $item) {
                $back[$i] = array('publisher' => $item['publisher'], 'lostThing' => $item['lostThing'],
                    'owner' => $item['loser'], 'lostTime' => $item['publishTime'], 'contact' => $item['contact']);
                $i++;
            }
            echo htmlspecialchars(json_encode($back));
        }
    }
    else {
        $back = array('code' => '1');
        echo htmlspecialchars(json_encode($back));
    }