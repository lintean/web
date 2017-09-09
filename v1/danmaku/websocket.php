<?php
/*
创建类websocket($config);
$config结构:
$config=array(
	"address"=>"192.168.0.200",//绑定地址
	"port"=>"8000",//绑定端口
	"event"=>"WSevent",//回调函数的函数名
	"log"=>true,//命令行显示记录
);
 
回调函数返回数据格式
function WSevent($type,$event)
 
$type字符串 事件类型有以下三种
in  客户端进入
out 客户端断开
msg 客户端消息到达
均为小写
 
$event 数组
$event["k"]内置用户列表的userid;
$event["sign"]客户标示
$event["msg"]收到的消息 $type="msg"时才有该信息
 
方法:
run()运行
search(标示)遍历取得该标示的id
close(标示)断开连接
write(标示,信息)推送信息
idwrite(id,信息)推送信息
 
属性:
$users 客户列表
结构:
$users=array(
[用户id]=>array("socket"=>[标示],"hand"=[是否握手-布尔值]),
[用户id]=>arr.....
)
*/

class websocket
{
	public $log;
	public $event;
	public $sign;
	public $sockets;
	public $users;
	public $master;

	public function __construct($config)
	{
		if (substr(php_sapi_name(), 0, 3) !== "cli")
			die("请通过命令行模式运行!");
		error_reporting(E_ALL);
		set_time_limit(0); // 让脚本一直运行
		ob_implicit_flush(); // 每个输出自动flush
		$this->event = $config["event"];
		$this->log = $config["log"];
		$this->master = $this->WebSocket($config["address"], $config["port"]);
		$this->sockets = array("s"=>$this->master);
	}

	function WebSocket($address, $port)
	{
		$server = socket_create(
			AF_INET, // IPv4 网络协议
			SOCK_STREAM, // 提供一个顺序化的、可靠的、全双工的、基于连接的字节流
					// 支持数据传送流量控制机制,TCP 协议即基于这种流式套接字
			SOL_TCP // 使用TCP协议
		);	//创建一个套接字
		if(!$server)
		{
			$this->log("套接字创建失败，即将退出");
			sleep(1);
			exit();
		}   //套接字创建失败
		if(!socket_set_option($server, SOL_SOCKET, SO_REUSEADDR, 1))  //改变设置
			exit();
		if(!socket_bind($server, $address, $port))   //绑定端口
		{
			$this->log("绑定端口失败，即将退出");
			sleep(1);
			exit();
		}
		if(!socket_listen($server))
		{
			$this->log("服务器创建失败，即将退出");
			sleep(1);
			exit();
		}
		$this->log("开始监听: ".$address." : ".$port);
		return $server;
	}

	function run()
	{
		while(true)
		{
			$changes = $this->sockets;
			$write = NULL;
			$except = NULL;
			socket_select($changes, $write, $except, NULL);
			foreach($changes as $sign)
			{
				if($sign == $this->master)
				{
					$client = socket_accept($this->master);
					if($client < 0)
						$this->log("socket_accept() 失败");
					$this->sockets[] = $client;
					$user = array(
						"socket" => $client,
						"hand"   =>  false,
					);
					$this->users[] = $user;
					$k = $this->search($client);
					$eventreturn = array("k"=>$k, "sign"=>$sign);
					$this->eventoutput("in", $eventreturn);
				}
				else
				{
					$buffer = NULL;
					$len = @socket_recv($sign, $buffer, 2048, 0);
					$k = $this->search($sign);
					$user = $this->users[$k];
					if($len < 9)
					{
						$this->close($sign);
						$eventreturn = array("k"=>$k, "sign"=>$sign);
						$this->eventoutput("out", $eventreturn);
						continue;
					}
					if(!$user["hand"])
					{
						//没有握手进行握手
						$this->handshake($k, $buffer);
					}
					else
					{
						$buffer = $this->uncode($buffer);
						if(!$buffer)
						{
							$this->close($sign);
							$eventreturn = array("k"=>$k, "sign"=>$sign);
							$this->eventoutput("out", $eventreturn);
							continue;
						}
						$eventreturn = array("k"=>$k, "sign"=>$sign, "msg"=>$buffer);
						$this->eventoutput("msg", $eventreturn);
					}
				}
			}
		}
	}

	function search($sign)
	{
		//通过标示遍历获取id
		foreach ($this->users as $k=>$v)
		{
			if($sign == $v["socket"])
			return $k;
		}
		return false;
	}

	function close($sign)
	{
		//通过标示断开连接
		$k = array_search($sign, $this->sockets);
		socket_close($sign);
		unset($this->sockets[$k]);
		unset($this->users[$k]);
	}

	function handshake($k, $buffer)
	{
		$buf = substr($buffer, strpos($buffer, "Sec-WebSocket-Key:") + 18);
		$key = trim(substr($buf, 0, strpos($buf, "\r\n")));
		$new_key = base64_encode(sha1($key."258EAFA5-E914-47DA-95CA-C5AB0DC85B11", true));
		$new_message = "HTTP/1.1 101 Switching Protocols\r\n";
		$new_message .= "Upgrade: websocket\r\n";
		$new_message .= "Sec-WebSocket-Version: 13\r\n";
		$new_message .= "Connection: Upgrade\r\n";
		$new_message .= "Sec-WebSocket-Accept: " . $new_key . "\r\n\r\n";
		socket_write($this->users[$k]["socket"], $new_message, strlen($new_message));
		$this->users[$k]["hand"] = true;
		return true;
	}

	function uncode($str)
	{
		$decoded = '';
	    $len = ord($str[1]) & 127;
	    if ($len === 126)
	    {
	        $masks = substr($str, 4, 4);
	        $data = substr($str, 8);
	    }
	    else if ($len === 127)
	    {
	        $masks = substr($str, 10, 4);
	        $data = substr($str, 14);
	    }
	    else
	    {
	        $masks = substr($str, 2, 4);
	        $data = substr($str, 6);
	    }
	    $n = strlen($data);
	    for ($i = 0; $i < $n; $i++)
	        $decoded .= $data[$i] ^ $masks[$i % 4];
	    return $decoded;



		$mask = array();
		$data = "";
		$msg = unpack("H*", $str);
		$head = substr($msg[1], 0, 2);
		if (hexdec($head{1}) === 8)
			$data = false;
		else if (hexdec($head{1}) === 1)
		{
			$mask[] = hexdec(substr($msg[1], 4, 2));
			$mask[] = hexdec(substr($msg[1], 6, 2));
			$mask[] = hexdec(substr($msg[1], 8, 2));
			$mask[] = hexdec(substr($msg[1],10, 2));
			$s = 12;
			$e = strlen($msg[1]) - 2;
			$n = 0;
			for ($i=$s; $i<= $e; $i+= 2)
			{
				$data .= chr($mask[$n%4]^hexdec(substr($msg[1],$i,2)));
				$n++;
			}
		}
		return $data;
	}

	function code($msg)
	{
		$frame = [];
        $frame[0] = '81';
        $len = strlen($msg);
        if ($len < 126)
            $frame[1] = $len < 16 ? '0'.dechex($len) : dechex($len);
        else if ($len < 65025)
        {
            $s = dechex($len);
            $frame[1] = '7e' . str_repeat('0', 4 - strlen($s)) . $s;
        }
        else
        {
            $s = dechex($len);
            $frame[1] = '7f' . str_repeat('0', 16 - strlen($s)) . $s;
        }
        $data = '';
        $l = strlen($msg);
        for ($i = 0; $i < $l; $i++)
            $data .= dechex(ord($msg{$i}));
        $frame[2] = $data;
        $data = implode('', $frame);
        return pack("H*", $data);
	}

	function idwrite($id, $t)//通过id推送信息
	{
		//通过id推送信息
		if(!isset($this->users[$id]["socket"]))
			return false; //没有这个标示
		$t = $this->code($t);
		return socket_write($this->users[$id]["socket"], $t, strlen($t));
	}

	function write($k, $t)  //通过标示推送信息
	{

		$t = $this->code($t);
		return socket_write($k, $t, strlen($t));
	}

	function eventoutput($type, $event) //事件回调
	{
		call_user_func($this->event, $type, $event);
	}

	function log($t)//控制台输出
	{
		//控制台输出
		if($this->log)
		{
			$t = $t."\r\n";
			fwrite(STDOUT, iconv("utf-8", "gbk//IGNORE", $t));
		}
	}
}