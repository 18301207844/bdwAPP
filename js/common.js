var ls=window.localStorage;

// 定义一个common的构造函数
function Common(){

}

Common.prototype={
    // ajax请求-get方式
    access_server:function(url,data,callback,asy){
        var _this=this;
        // 显示加载动画
        this.showLoading();
        asy=typeof(asy)==="undefined"?true:asy;
        $.ajax({
            url:url,
            data:data,
            dataType:"json",
            async:asy,
            success:function(data){
                setTimeout(function(){
                    // 隐藏加载动画
                    _this.hideLoading();
                    callback && callback(data);
                },500)
            },
            error:function(){
                setTimeout(function(){
                    _this.hideLoading();
                    _this.showDialog("请求失败，请刷新/重试","关闭");
                },500)
            }
        })
    },
    // 显示加载动画
    showLoading:function(){
        this.showMark();
        // 生成加载动画
        if($("#ui-id-loading").length==0){
            var $loading=$('<div class="ui-id-loading" id="ui-id-loading"><img></div>');
            $loading.children('img').attr("src","../img/loading.gif");
            $loading.appendTo($("body"));
        }
    },
    // 删除加载动画
    hideLoading:function(){
        $('#ui-id-mark').remove();
        $('#ui-id-loading').remove();
    },
    // 显示遮罩层
    showMark:function(){
        if($('#ui-id-mark').length==0){
           $('<div id="ui-id-mark" class="ui-id-mark"></div>').appendTo($("body"));
        }
    },
    // 删除遮罩层
    hideMark:function(){
        $('#ui-id-mark').remove();
    },
    // 显示弹出框
    showDialog:function(msg,btn,callback){
        var _this=this;
        this.showMark();
        if($("#ui-id-dialog").length==0){
            var html='<div class="ui-id-dialog" id="ui-id-dialog">'
                         +'<div class="tipcontainer">'
                              +'<div class="content">'+msg+'</div>'
                              +'<p class="btns">'
                                   +'<a href="javascript:void(0)" id="dialog-btn">'+btn+'</a>'
                              +'</p>'
                         +'</div>'
                      +'</div>';
            $(html).appendTo($("body"));
            $("#dialog-btn").on("click",function(){
                _this.hideDialog();
                callback && callback();
            })
        }
    },
    // 隐藏弹出框
    hideDialog:function(){
         this.hideMark();
         $("#ui-id-dialog").remove();
    },
    // 检测手机号码
    checkPhone:function(phone){
       var reg=/^1[3578]\d{9}$/;
       if(reg.test(phone)){
           return true;
       }
       return false;
    },
    // 检测密码
    checkPwd:function(pwd){
        var reg=/^\w{5,20}$/;
        if(reg.test(pwd)){
            return true;
        }
        return false;
    },
    // 检测身份证号码
    checkCard:function(card){
        var reg=/^\d{17}(x|\d)$/;
        if(reg.test(card)){
            return true;
        }
        return false;
    }
}

var common=new Common();

// 解析地址栏中的参数
function getParam(){
	var url=location.search;
    if(!url)return false;
    url=url.substr(1);
    // city_id=143&city_name=%E5%8E%A6%E9%97%A8
    var params=url.split("&"),arr,param={};
    $.each(params,function(i,obj){
        arr=obj.split("=");
        param[arr[0]]=decodeURI(arr[1]);
    })
    return param;
}

/*function getParams(name){
    var url=location.search.substr(1);
    if(!url)return false;
    // url=city_id=64&city_name=%E6%B2%88%E9%98%B3
    var reg=new RegExp('(^|&)'+name+'=([^&]+)');
    var result=url.match(reg);
    if(!result)return false;
    return decodeURI(result[2]);
}

console.log(getParams("city_name"));
*/

function addZero(num){
    if(num<10){
       return '0'+num;
    }else{
       return num;
    }
}

// 生成某一个日期之后的i天的一个日期
function getDefaultDate(i,opt){
    var date=opt?new Date(opt.year,opt.mon,opt.day):new Date(),   // 当前日期
        i=typeof(i)==="undefined"?0:i,
        times=date.getTime()+86400000*i,   // i天的毫秒   24*60*60*1000
        tempDate=new Date();   // 目标日期
    tempDate.setTime(times);
    var year=tempDate.getFullYear(),
        mon=tempDate.getMonth()+1,
        day=tempDate.getDate();
    return year+'-'+addZero(mon)+'-'+addZero(day);
}

// 显示日历
function displayCalendar(ele,minDate,maxDate,pageType){
    ele.calendar({
        minDate:minDate,
        maxDate:maxDate,
        swipeable:true,
        hide:function(){   // hide是日历隐藏之后要执行的回调函数
            changeDateOut(pageType)
        }    
    }).calendar("show");

    $('.shadow').remove();
    $('.ui-slideup-wrap').addClass('calenderbox');
    var shadow=$('<span class="shadow"></span>');
    $('.calenderbox').append(shadow);
    $('.ui-slideup').addClass('calender');
}

// 将字符串转换为数值
function strToNumer(str){
    return str.replace(/-/g,"");
}

// 将字符串转换为数组
function strToArray(str){
    return str.split("-");
}

// 显示月和日
function formatMonthDay(str){
    // 2016-06-08
    var mon=str.substr(5,2),
        day=str.substr(8);
    return mon+'月'+day+'日';
}

//日历隐藏之后要执行的回调函数
function changeDateOut(action){
    var dateIn=$("#date_in").val(),
        newDateOut=dateOut=$("#date_out").val(),
        dateInArr=strToArray(dateIn),
        dateInNum=strToNumer(dateIn),
        dateOutNum=strToNumer(dateOut);
    if(dateInNum>=dateOutNum){
        newDateOut=getDefaultDate(1,{year:dateInArr[0],mon:dateInArr[1]-1,day:dateInArr[2]});
        // 修改离店日期
        $("#date_out").val(newDateOut);
    }
    // 如果是index首页
    if(typeof(action)==="undefined")return;
    $("#inText").text(formatMonthDay(dateIn));
    $("#outText").text(formatMonthDay(newDateOut));
    POST.dateIn=dateIn;
    POST.dateOut=newDateOut;
    POST.pageNo=1;
    // 如果是列表页
    if(action=="list"){
        sendHttpToHotel("edit");
    }else{
        sendHttpFromDetail("edit"); 
    }
}

// 修改日历
$("#modify").on("click",function(){
    var date=new Date(),
        minDate=new Date(date.getFullYear(),date.getMonth(),date.getDate()),
        maxDate=new Date(date.getFullYear(),date.getMonth(),date.getDate()+90);
    // 显示日历
    displayCalendar($("#date_in"),minDate,maxDate,$(this).data("type"));
})

// 判断用户是否已经登陆了
function ifLogined(url){
    common.access_server("../server/check.php",{},function(data){
        if(data.if_logined==0){
            location.href='login.html';
            localStorage.setItem("orderUrl",url);
        }else{
            location.href=url;
        }
    });
}


 