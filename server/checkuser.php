<?php
  require_once 'sql.lib.inc';
  $select = new hotel();
  $phone=$_REQUEST["phone"];
  $pwd=$_REQUEST["pwd"];
  $sql='select * from user where user="'.$phone.'"';
  $rows = $select->selectDB($sql);
  if(count($rows)==0){
    echo '{"code":1,"msg":"该手机号码没有注册过"}';
  }else{
     $sql.=' and password="'.$pwd.'"';
     $rows2=$select->selectDB($sql);
     if(count($rows2)==0){
        echo '{"code":2,"msg":"密码输入有误"}';
     }else{
       echo '{"code":0,"msg":"登陆成功"}';
     }
  }
?>