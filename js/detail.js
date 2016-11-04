// 解析地址栏中的参数
var isc=new iScroll("section"),
    param=getParam(),
    cityId=param.city_id,
    dateIn=param.date_in,
    dateOut=param.date_out,
    name=param.hotel_name,
    id=param.hotel_id,
    pageNo=1,     // 页次
    pageSize=10,   // 每页显示的记录数
    stars=["","","二星以下/经济型","三星","四星","五星"],
    // ajax请求时传递给后台的参数列表
    POST={
    	cityId:cityId,
        hotelId:id,
    	dateIn:dateIn,
    	dateOut:dateOut,
        pageNo:pageNo,
        pageSize:pageSize
    };
// 显示、设置入住和离店日期
$("#date_in").val(dateIn);
$("#date_out").val(dateOut);
$("#inText").text(formatMonthDay(dateIn));
$("#outText").text(formatMonthDay(dateOut));

function init(){
    sendHttpFromDetail();
    bindEvent();
}

// ajax请求
function sendHttpFromDetail(action){
     common.access_server("../server/hotelDetail.json",POST,function(data){
          if(data.errcode==0){
              renderDetailToDom(data.result,action);
          }
     });
}

// 渲染酒店及房间信息
function renderDetailToDom(data,action){
    var img="../"+data.images.split(";")[0];
    localStorage.setItem("hotelImg",img);
    $("#hotel_img>img").attr("src",img);
    var $li=$("#hotel_info_list>li");
    $("#hotel_name").text(name);
    $li.eq(0).text(stars[data.star]);
    $li.eq(1).html(data.tel.replace(/,/g,"&nbsp;&nbsp;&nbsp;&nbsp;"));
    $li.eq(2).text(data.addr);
    $("#description").text(data.desc);
    $("#sheshi").text(data.facilities);
    // 渲染房间信息
    var html='',btn='',price;
    if(action) $("#detail_list").empty();
    for(var i=0,len=data.room_types.length;i<len;i++){
        var obj=data.room_types[i];
        $.each(obj.goods,function(k,room){
            price=Math.min.apply(null,room.price)/100;
            if(room.room_state==1){
                btn='<span data-roomtype="'+obj.name+'" data-typeid="'+obj.type_id+'" data-roomid="'+room.room_id+'" data-price="'+price+'">预定</span>';
            }else{
                btn='<span class="full">客满</span>';
            }
            html+='<div class="detail_row">'
                      +'<dl>'
                          +'<dt>'+obj.name+'</dt>'
                          +'<dd>'+obj.bed_type+'</dd>'
                      +'</dl>'
                      +'<p>'+price+'</p>'
                      +btn
                  +'</div>'
        });
    }
    $(html).appendTo($("#detail_list"));
    isc.refresh();
}

function bindEvent(){
    $(".base_info").on("click","li",function(){
        $(this).addClass("on").siblings().removeClass("on");
        var index=$(this).index();
        $(".content_wrap>div").eq(index).addClass("cur_info").siblings().removeClass("cur_info")
    })
    // 展开和收起
    $(".hotel_btn").on("click",function(){
        var $article=$(this).prev();
        if($(this).text()=="展开详情"){
            $(this).text("收起");
            $article.css("height","auto");
        }else{
            $(this).text("展开详情");
            $article.css("height","3.2rem");
        }
    })
    // 预定房间
    $("#detail_list").on("click","span",function(){
        if($(this).is(".full"))return;
        // 检测用户的状态（是否已经登陆）
        // 找出订单页的地址
        var typeId=$(this).data("typeid"),
            typeName=$(this).data("roomtype"),
            roomId=$(this).data("roomid"),
            price=$(this).data("price"),
            url='order.html?city_id='+cityId+'&date_in='+$("#date_in").val()
                +'&date_out='+$("#date_out").val()+'&hotel_id='+id
                +'&hotel_name='+encodeURI(name)+'&type_id='+typeId
                +'&type_name='+encodeURI(typeName)+'&room_id='+roomId
                +'&price='+price;
        ifLogined(url);
    })
}

init();

