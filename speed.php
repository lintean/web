<body>

<?php
$dir='./gallery/';
$files = scandir($dir);

foreach($files as $file) {
	if ($file != '.' && $file !='..'){
		$url='http://'.$_SERVER['SERVER_NAME'].'/speed/'.$file;
		//echo $url;
		?>
		<a href="<?php echo $url;?>"><?php echo $url;?></a> <br>
		<?php
	}
}
?>

</body>
