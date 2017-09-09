<?php
	require "websocket.php";
	session_start();

	$config = array(
		'address'=>'192.168.1.135',
		'port'=>'8001',
		'event'=>'WSevent',//回调函数的函数名
		'log'=>true,
	);

	$ws = new websocket($config);
	$ws->run();

	function WSevent($type, $event){
		global $ws;
		global $keymax;
		$key = $event["k"]; // $key为客户端的ID，每次都会从0开始自增，可以唯一标示客户端
		if ($key>$keymax) $keymax=$key;

		if('in' == $type){
			// 表示某客户端连接成功
		}
		elseif('out' == $type) {
			// 表示某客户端断开连接
		}
		elseif('msg' == $type) {
			// 表示某客户端发送消息给服务器，消息内容为 $event['msg']

			$obj = json_decode($event['msg']);

			$connect = new PDO("mysql:host=localhost;dbname=danmaku", 'root', '');
			if (!$connect) die("连接错误");

			$sql = "select * from `user_center` where sessionId = ?";
			$sth = $connect->prepare($sql);
			$sth->execute(array($obj->sessionId));
			$result = $sth->fetch(PDO::FETCH_OBJ);

			$ws->log($event['msg']);

			if (true)
				if (true) {
					$arr = array('user'=>'123','text'=>$obj->text,'position'=>$obj->position,'color'=>$obj->color,);

					$ws->log($event['msg']);
					$ws->idwrite($key, json_encode(array('code'=>0)));

					for ($i=0;$i<=$keymax;++$i){
						$ws->idwrite($i, json_encode($arr)); // 发送消息
					}
					// 给特定用户发送消息时需提供用户ID，即用户的唯一标识的$key,所以需要在合的时候记录$key并保存在变量中或数据库适中
				}
				else
					$ws->idwrite($key, json_encode(array('code'=>1,'message'=>"你已被禁言！")));
			else
				$ws->idwrite($key, json_encode(array('code'=>1,'message'=>"登陆验证失败！")));

		}
	}



/*elseif('msg' == $type) {
	// 表示某客户端发送消息给服务器，消息内容为 $event['msg']

	$arr = json_decode($event['msg'],[true]);

	if ($arr['id'] == $_SESSION['id'])
		if ($_SESSION['isBanned'] == 0) {
			$arr['user'] = $_SESSION['user'];  //添加元素
			array_shift($arr);		//删除第一个元素

			$ws->log($event['msg']);
			$ws->idwrite($key, json_encode(array('code'=>0)));

			for ($i=0;$i<=$keymax;++$i){
				$ws->idwrite($i, json_encode($arr)); // 发送消息
			}
			// 给特定用户发送消息时需提供用户ID，即用户的唯一标识的$key,所以需要在合的时候记录$key并保存在变量中或数据库适中
		}
		else
			$ws->idwrite($key, json_encode(array('code'=>1,'message'=>"你已被禁言！")));
	else
		$ws->idwrite($key, json_encode(array('code'=>1,'message'=>"登陆验证失败！")));

}*/



/*$obj = json_decode($event['msg'],[false]);

if ($obj->id == $_SESSION['id'])
	if ($_SESSION['isBanned'] == 0) {
		$arr['user'] = $_SESSION['user'];  //添加元素
		array_shift($arr);		//删除第一个元素

		$ws->log($event['msg']);
		$ws->idwrite($key, json_encode(array('code'=>0)));

		for ($i=0;$i<=$keymax;++$i){
			$ws->idwrite($i, json_encode($arr)); // 发送消息
		}
		// 给特定用户发送消息时需提供用户ID，即用户的唯一标识的$key,所以需要在合的时候记录$key并保存在变量中或数据库适中
	}
	else
		$ws->idwrite($key, json_encode(array('code'=>1,'message'=>"你已被禁言！")));
else
	$ws->idwrite($key, json_encode(array('code'=>1,'message'=>"登陆验证失败！")));

}*/