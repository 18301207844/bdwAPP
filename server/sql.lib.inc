<?php
	 header("Content-type: text/html; charset=utf-8");
	class hotel {
		public function __construct(){
			$host = "localhost";
			$user = "root";
			$pwd = "";
			$database_name = "baidawu";
			$link = mysql_pconnect( $host, $user, $pwd ) or die('error');
			mysql_select_db( $database_name );
		}
		
		public function selectDB( $sql ){
			mysql_query( "set names 'utf8' " );
			$arr = array();
			$result = mysql_query( $sql );
			while( $row = mysql_fetch_array( $result )){
				$arr[] = $row;
			}
			return $arr;
		}
		
		public function manageDB( $sql ){
			mysql_query( "set names 'utf8' " );
			return mysql_query( $sql );
		}
	}
?>
