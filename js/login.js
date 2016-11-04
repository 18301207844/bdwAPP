function init(){
	bindEvent();
}

function bindEvent(){
	// 手机号码只能输入数字
	$("#phone").on("input propertychange",checkPhone);
	// 密码框
	$("#password").on("input propertychange",checkInput);
	// 登陆按钮
	$("#login").on("click",login);
}

// 检测手机
function checkPhone(){
	var phone=this.value;
	// 将phone中的非数字替换为空
	var reg=/\D/g;
    this.value=phone.replace(reg,"");
    checkInput();
}

// 检测手机号码和密码框
function checkInput(){
    var phone=$.trim($("#phone").val()),
        pwd=$.trim($("#password").val()),
        $login=$("#login");
    if(phone && pwd){
       $login.addClass("activ");
    }else{
       $login.removeClass("activ");
    }
}

// 登陆
function login(){
	if(!$(this).hasClass("activ"))return;
	var phone=$.trim($("#phone").val()),
	    pwd=$.trim($("#password").val());
	// 检测手机号码格式是否正确
	if(!common.checkPhone(phone)){
        common.showDialog("请输入有效的手机号码","关闭",function(){
        	$("#phone").val("");
        });
        return;
	}
	if(!common.checkPwd(pwd)){
        common.showDialog("请输入5到20位以字母开头的字母数字下划线组成的密码","关闭",function(){
        	$("#password").val("");
        });
        return;
	}
	// 验证是否能够登陆
	common.access_server("../server/checkuser.php",{phone:phone,pwd:pwd},function(data){
        var code=data.code,msg=data.msg;
        if(code==1){
            common.showDialog(msg,"关闭",function(){
            	location.href="register.html";
            });
        }else if(code==2){
            common.showDialog(msg,"关闭",function(){
            	$("#password").val("");
            })
        }else{
            location.href=localStorage.getItem("orderUrl");
        }
	})
}

init();