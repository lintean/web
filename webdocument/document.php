<?php
    header("Content-type:text/html;charset=UTF-8");

//    mb_internal_encoding("GBK");
//    echo mb_internal_encoding()."\n";
//
//    echo iconv("GBK","UTF-8","�ȡ��ЦĨj�e����");
//    echo "����˵��";
//    echo "�ȡ��ЦĨj�e����";

//    mb_internal_encoding("GB2312");
//    echo mb_internal_encoding();

    $start_time = time();
    $path = "gallery";
    $filename ="gallery/gallery.zip";
    $pos = strrpos($filename,"/");
    $path = $path.substr($filename,$pos,strrpos($filename,".") - $pos);

    //��ѹ���ļ�
//    $zip = zip_open($filename);
//
//    //�����ȡzip�ļ������Ŀ��Դ
//    while ($item = zip_read($zip)){
//
//        //�����ȡ������Ŀ��Դ�ɱ���(������������
//        if (zip_entry_open($zip,$item)){
//
//            //���ȼ��·���Ƿ���ڣ����������½�
//            $file_name = $path.zip_entry_name($item);
//
//            echo zip_entry_name($item)."\n";
//            $file_path = substr($file_name,0,strrpos($file_name,"/"));
//            if (!is_dir($file_path)){
//                mkdir($file_path,0777,true);
//            }
//
//            //��ȡ���Ŀ�����Ŀ¼Ҳ�������ļ��������Ŀ¼֮ǰ���½�
//
//            if (!is_dir($file_name)){
//                //��ȡ�ļ���Դ
//                //����ļ���С����50M�������
//                $file_size = zip_entry_filesize($item);
//                if ($file_size < 1024 * 1024 * 50){
//                    $resource = zip_entry_read($item,$file_size);
//                    file_put_contents(iconv("GBK","UTF-8",$file_name),$resource);
//                }
//                else echo "<p> ".$i++." ���ļ��ѱ�������ԭ���ļ����� -> ".$file_name." </p>";
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