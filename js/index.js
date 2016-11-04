function init(){
	showCity();
	showCalendar();
	bindEvent();
}
 var swiper = new Swiper('.swiper-container', {
	        pagination: '.swiper-pagination',   //点
	        paginationClickable: true,  //点击 点
	        /**nextButton: '.swiper-button-next',  //左按钮
	          *prevButton: '.swiper-button-prev',    //右按钮*/
	        slidesPerView: 1,    //呈现几个页面   
	        spaceBetween: 0,//页面之间的边框   
	        loop: true,   //循环
	        autoplay:1000  //自动
	    });
function showCity(){
	var param=getParam(),
	    cityName=param.city_name,
	    cityId=param.city_id;
	if(param){
       $("#city_id").val(cityId);
       $("#city_name").text(cityName);
       ls.setItem("cityId",cityId);
       ls.setItem("cityName",cityName);
	}else{
       ls.setItem("cityId","28");
       ls.setItem("cityName","北京");
       $("#city_id").val(28);
       $("#city_name").text("北京");
	}
}

// 日历
function showCalendar(){
	$("#date_in").val(getDefaultDate());
	$("#date_out").val(getDefaultDate(1));
	var date=new Date(),
	    minDate=new Date(date.getFullYear(),date.getMonth(),date.getDate());
	// 入住文本框激活时调用组件
	$("#date_in").focus(function(){
		// 结束日期
        var maxDate=new Date(date.getFullYear(),date.getMonth(),date.getDate()+90);
	    displayCalendar($(this),minDate,maxDate);
	})
	// 离店文本框激活时调用组件
	$("#date_out").focus(function(){
		// 结束日期
        var maxDate=new Date(date.getFullYear(),date.getMonth(),date.getDate()+91);
	    displayCalendar($(this),minDate,maxDate);
	})
}

// 绑定事件
function bindEvent(){
	$("#search").on("click",function(){
		 var cityId=$("#city_id").val(),
		     dateIn=$("#date_in").val(),
		     dateOut=$("#date_out").val(),
		     name=$.trim($("#name").val()),
		     url='html/hotel.html?city_id='+cityId+'&date_in='+dateIn+'&date_out='+dateOut+'&name='+name;
		$(this).attr("href",url);
	})
}

init();