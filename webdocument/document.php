<?php
    header("Content-type:text/html;charset=UTF-8");

//    mb_internal_encoding("GBK");
//    echo mb_internal_encoding()."\n";
//
//    echo iconv("GBK","UTF-8","┤·┬δ╦╡├≈");
//    echo "代码说明";
//    echo "┤·┬δ╦╡├≈";

//    mb_internal_encoding("GB2312");
//    echo mb_internal_encoding();

    $start_time = time();
    $path = "gallery";
    $filename ="gallery/gallery.zip";
    $pos = strrpos($filename,"/");
    $path = $path.substr($filename,$pos,strrpos($filename,".") - $pos);

    //打开压缩文件
//    $zip = zip_open($filename);
//
//    //逐项读取zip文件里的项目资源
//    while ($item = zip_read($zip)){
//
//        //如果读取到的项目资源可被打开(无上锁，无损坏
//        if (zip_entry_open($zip,$item)){
//
//            //首先检查路径是否存在，不存在则新建
//            $file_name = $path.zip_entry_name($item);
//
//            echo zip_entry_name($item)."\n";
//            $file_path = substr($file_name,0,strrpos($file_name,"/"));
//            if (!is_dir($file_path)){
//                mkdir($file_path,0777,true);
//            }
//
//            //读取到的可能是目录也可能是文件，如果是目录之前会新建
//
//            if (!is_dir($file_name)){
//                //读取文件资源
//                //如果文件大小超过50M，则放弃
//                $file_size = zip_entry_filesize($item);
//                if ($file_size < 1024 * 1024 * 50){
//                    $resource = zip_entry_read($item,$file_size);
//                    file_put_contents(iconv("GBK","UTF-8",$file_name),$resource);
//                }
//                else echo "<p> ".$i++." 此文件已被跳过，原因：文件过大， -> ".$file_name." </p>";
//            }
//
//            zip_entry_close($item);
//        }
//    }

//    $zip = new \ZipArchive;
//    if (false !== $zip->open($filename)){
//
//        for ($i = 0;$i < $zip->numFiles; ++$i){
//            $statInfo = $zip->statIndex($i);
//            $entry_name = mb_convert_encoding($statInfo['name'],"UTF-8","GBK");
//            echo $statInfo['name']."\n";
//            if ($statInfo['crc'] == 0)
//                mkdir($path."/".$entry_name,true);
//            else
//                copy('zip://'.$filename.'#'.$entry_name,$path.'/'.$entry_name);
//        }
//        $zip->close();
//    }

    $zip = new ZipArchive();
    if ($zip->open($filename) !== false){
        $zip->extractTo($path);
        $zip->close();
    }


    $end_time = time();
    $last_time = $end_time - $start_time;
    echo $last_time;
?>