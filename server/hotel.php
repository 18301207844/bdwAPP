<?PHP
	require_once 'sql.lib.inc';
	$select = new hotel();
	$cityId=$_GET["cityId"];
	$dateIn=$_GET["dateIn"];
	$dateOut=$_GET["dateOut"];
	$key=isset($_GET["name"])?$_GET["name"]:"";
	$sortType=isset($_GET["sortType"])?$_GET["sortType"]:"";
	$minPrice=isset($_GET["minPrice"])?$_GET["minPrice"]:"";
	$maxPrice=isset($_GET["maxPrice"])?$_GET["maxPrice"]:"";
	$brand=isset($_GET["brand"])?$_GET["brand"]:"";
	$stars=isset($_GET["stars"])?$_GET["stars"]:"";
	//$pageNo=$_GET["pageNo"];
	//$pageSize=$_GET["pageSize"];
	//$from=$pageNo*$pageSize-$pageSize;
	$type="";
	$sql='select * from hotel where cityId='.$cityId.' and dateIn like "%'.$dateIn.'%"';
	if($key!=null and $key!=-1){
       $sql.=' and name like "%'.$key.'%"';
	}
	if($minPrice!=null and $minPrice!=-100){
       $sql.=' and price>='.$minPrice;
	}
	if($maxPrice!=null and $maxPrice!=-100){
       $sql.=' and price<='.$maxPrice;
	}
	if($brand!=null and $brand!=-1){
       $sql.=' and brand="'.$brand.'"';
	}
	if($stars!=null and $stars!=-1){
       $sql.=' and starts='.$stars;
	}
	if($sortType!=null and $sortType!=-1){
       if($sortType=='priceMax'){
         $type="price desc";
       }else if($sortType=='priceMin'){
         $type="price asc";
       }
	}
	$sqls=$sql;
	if($type!=''){
       $sql.=" order by ".$type;
	}
	//$sql.=" limit ".$from.','.$pageSize;
	$rows = $select->selectDB($sql);
	$counts = $select->selectDB($sql);
	if(count($rows)<=0){
       echo '{
          "errcode":1,
          "errmsg":"没有数据",
          "result":{}
       }';
	}else{
	   $str='{
               "errcode":0,
               "errmsg":"请求成功",
               "count":'.count($counts).',
               "result":{
             	  "hotel_list":[
	   ';
       foreach( $rows as $k=>$v ){
	       	$str.='{';
	       	$str.='"hotel_id":'.$v["id"].',
	       		   "name":"'.$v["name"].'",
	       		   "addr":"'.$v["address"].'",
	       		   "stars":'.$v["starts"].',
	       		   "image":"../'.$v["pic"].'",
	       		   "low_price":'.$v["price"];
	        if($k==count($rows)-1){
                $str.='}';
	        }else{
	        	$str.='},';
	        }
       }
       $str.=']}}';
       echo $str;
	}
?>

