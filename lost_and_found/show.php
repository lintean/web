<?php
    error_reporting(E_ALL & ~E_NOTICE );
    $connect = new PDO("mysql:host=localhost;dbname=lost_and_found", 'root', '');
    if (!$connect) die("连接错误");

    $_POST['keyword'] = '%';
    $_POST['page'] = '1';

    $l = (json_decode($_POST['page']) - 1) * 20;

    $sql = "select SQL_CALC_FOUND_ROWS * from `list` where publisher like ? or lostThing like ? or loser like ? limit $l, 1";
    $sth = $connect->prepare($sql);
    $sth->execute(array('%'.$_POST['keyword']."%", "%".$_POST['keyword']."%", "%".$_POST['keyword']."%"));
    $result = $sth->fetchAll(PDO::FETCH_ASSOC);

    $sql = "SELECT found_rows() AS rowcount";
    $count = $connect->query($sql)->fetch(PDO::FETCH_OBJ);

    if (empty($result)) {
        $back = array('code'=>1);
        echo htmlspecialchars(json_encode($back));
    }
    else {
        $i = 3;
        $back[0] = array('code' => '0');
        $back[1] = array('total' => floor((int)($count->rowcount)/20) + 1);
        $back[2] = array('page' => $_POST['page']);
        foreach($result as $item) {
            $back[$i] = array('publisher' => $item['publisher'], 'lostThing' => $item['lostThing'],
                'owner' => $item['loser'], 'lostTime' => $item['publishTime'], 'contact' => $item['contact']);
            $i++;
        }
        echo htmlspecialchars(json_encode($back));
    }