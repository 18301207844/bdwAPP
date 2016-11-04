// 解析地址栏中的参数
var isc=new iScroll("orderbox",{
	 onBeforeScrollStart:function(event){
	 	 var ele=event.target.tagName.toLowerCase();
	 	 if(ele!="input" && ele!="textarea" && ele!="select"){
             event.preventDefault();
	 	 }
	 }
}),

    param=getParam(),
    cityId=param.city_id,
    dateIn=param.date_in,
    dateOut=param.date_out,
    name=param.hotel_name,
    id=param.hotel_id,
    typeId=param.type_id,
    typeName=param.type_name,
    roomId=param.room_id,
    price=param.price;
    console.log(id)

function init(){
	renderToDom();
    bindEvent();
}

function renderToDom(){
	$("#pics").attr("src",localStorage.getItem("hotelImg"));
	// 显示、设置入住和离店日期
	$("#date_in").val(dateIn);
	$("#date_out").val(dateOut);
	$("#inText").text(formatMonthDay(dateIn));
	$("#outText").text(formatMonthDay(dateOut));
	$("#tprice").text(price);
	$("#rprice").val(price);
}

function bindEvent(){
    // 加
    $("#add").on("click",function(){
    	if($(this).hasClass("no")){
    		common.showDialog("您最多只能预定5间","关闭");
    		return;
    	}
    	$("#sub").removeClass("no");
    	var count=parseInt($("#roomcount").val());
    	count++;
    	if(count>=5){
           count=5;
           $(this).addClass("no");
    	}
    	$("#roomcount").val(count);
    	changeTotalPrice(count);
    	appendNode(count);
    })
    // 减
    $("#sub").on("click",function(){
    	if($(this).hasClass("no")){
    		common.showDialog("您不能取消房间","关闭");
    		return;
    	}
    	$("#add").removeClass("no");
    	var count=parseInt($("#roomcount").val());
    	count--;
    	if(count<=1){
           count=1;
           $(this).addClass("no");
    	}
    	$("#roomcount").val(count);
    	changeTotalPrice(count);
    	removeNode();
    })

    // 清空文本框
    $("#info-boxs input[type=text]").showClear();
    $("#info-boxs .clear_input").closeClear();

    // 立即预定
    $("#booknow").on("click",function(){
        if(!checkAll())return;
        var userInfo={};
        $("#info-boxs input[type=text]").each(function(i,input){
        	var val=$(this).val();
        	if(i%2!=0 && input.id!="phone"){
                if(!common.checkCard(val)){
                	var num=input.id.substr(input.id.length-1);
                	if(num=="1") num="";
                    common.showDialog("证件"+num+'无效',"关闭");
                    return;
                }
        	}
        	if(input.id=="phone"){
               if(!common.checkPhone(val)){
                  common.showDialog("请输入有效的手机号码","关闭");
                  return;
               }
        	}
            userInfo[input.id]=val;
        })
        userInfo.city_id=cityId;
        userInfo.date_in=dateIn;
        userInfo.date_out=dateOut;
        userInfo.hotel_id=id;
        common.access_server("../server/order.php",userInfo,function(data){
            if(data.errcode==0) location.href="success.html";
        })
    })

    function checkAll(){
    	var $inputs=$("#info-boxs input[type=text]");
    	for(var i=0,len=$inputs.length;i<len;i++){
    	   if($inputs[i].value==""){
    	       common.showDialog("信息填写不完整，请重新填写","关闭");
    	       return false;
    	   }
    	}
    	return true;
    }
}

// 添加信息
function appendNode(count){
    var html='<div class="userInfo">'
		     	  +'<ul class="infos">'
		     		   +'<li><i>姓名'+count+'</i><input type="text" placeholder="每间只需填写一个姓名" id="userName'+count+'"><span class="clear_input">x</span></li>'
		     	  +'</ul>'
		     	  +'<ul class="infos">'
		     		   +'<li><i>证件'+count+'</i><input type="text" placeholder="入住人身份证好/证件号" id="idcard'+count+'"><span class="clear_input">x</span></li>'
		     	  +'</ul>'
			 +'</div>';
    $(html).appendTo($("#info"));
    $("#info input").showClear();
    $(".clear_input").closeClear();
    isc.refresh();
}

// 删除信息
function removeNode(){
    $("#info>div").last().remove();
}

function changeTotalPrice(count){
    var total=price*count;
    $("#tprice").text(total);
    $("#rprice").val(total);
}

(function($){
   $.extend($.fn,{
   	  	   showClear:function(){
   	          $(this).focus(function(){
   	          	  $(this).next().css("display","block");
   	          })
   	  	   },
   	  	   closeClear:function(){
   	  	   	  $(this).click(function(){
   	  	   	  	  $(this).prev().val("");
   	  	   	  	  $(this).css("display","none");
   	  	   	  })
   	  	   }
   })
})(Zepto)

init();