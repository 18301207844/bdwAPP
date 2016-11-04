var testCode="";
function init(){
   bindEvent();
}

function bindEvent(){
	// 手机号码只能输入数字
	$("#phone").on("input propertychange",checkPhone);
	// 给所有的文本框密码框
	$(".forms").on("input propertychange",'input',function(){
		var type=$(this).attr("type");
		if(type=="text" || type=="password"){
           $(this).on("input propertychange",checkInput);
		}
	})

	$("#isRead").on("change",checkInput);

	$("#pwd_on_off").on("click",function(){
		var $pwd=$("#pwd"),$round=$(".round");
		if($pwd.attr("type")=="password"){
            $pwd.attr("type","text");
            $(this).addClass("pwd-btn");
            $round.css({
            	'-webkit-transform':'translate3d(0,0,0)',
            	'-webkit-transition':'transform 0.3s linear'
            })
		}else{
            $pwd.attr("type","password");
            $(this).removeClass("pwd-btn");
            $round.css({
            	'-webkit-transform':'translate3d(50px,0,0)',
            	'-webkit-transition':'transform 0.3s linear'
            })
		}
	})
	//var flag=true;
	// 获取验证码
	$("#get_code_btn").on("click",function(){
		if($(this).data("flag"))return;
		var phone=$.trim($("#phone").val()),
		    times=10,
		    timer=null,
		    $btn=$(this);
		if(!common.checkPhone(phone)){
            common.showDialog("请输入有效的手机号码","关闭");
            return;
		}
		//if(!flag) return;
		common.access_server("../server/register.php",{phone:phone},function(data){
            var code=data.result.errcode,risg=data.result.risg;
            if(code==2){
                common.showDialog(risg);
            }else if(code==1){
                common.showDialog(risg,"关闭",function(){
                	location.href="register.html";
                });
            }else{
                testCode=risg;
            }
		});
		timer=setInterval(function(){
            times--;
            if(times<=0){
               clearInterval(timer);
               $btn.text("获取验证码").data("flag",false);
               //flag=true;
            }else{
               $btn.text(times+'秒后重试').data("flag",true);
               //flag=false;
            }
		},1000)
	})
    // 注册
    $("#next").on("click",function(){
    	 if(!$(this).hasClass("activ"))return;
    	 var phone=$.trim($("#phone").val()),
    	     pwd=$.trim($("#pwd").val()),
    	     code=$.trim($("#code").val()),
    	     isRead=$("#isRead").prop("checked");
    	 if(!common.checkPhone(phone)){
             common.showDialog("请输入有效的手机号码","关闭");
             return;
    	 }
         
         if(!common.checkPwd(pwd)){
             common.showDialog("请输入5到20位的字母数字下划线","关闭");
             return;
    	 }

    	 if(code!=testCode){
            common.showDialog("验证码输入有误","关闭");
            return; 
    	 }
    	 
    	 common.access_server("../server/registersubmit.php",{phone:phone,pwd:pwd},function(data){
             var errcode=data.result.errcode;
             if(errcode==0){
                 location.href="login.html";
             }else if(errcode==1){
                 common.showDialog("该手机号码已被注册过","关闭");
             }else{
                 common.showDialog("注册失败,请重试","关闭");
             }
    	 })
    })
}

function checkInput(){
	var phone=$.trim($("#phone").val()),
	    pwd=$.trim($("#pwd").val()),
	    code=$.trim($("#code").val()),
	    isRead=$("#isRead").prop("checked"),
	    $next=$("#next");
	if(phone && pwd && code && isRead){
        $next.addClass("activ");
	}else{
		$next.removeClass("activ");
	}
}

// 检测手机
function checkPhone(){
	var phone=this.value;
	// 将phone中的非数字替换为空
	var reg=/\D/g;
    this.value=phone.replace(reg,"");
    //checkInput();
}

init();