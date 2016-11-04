// 解析地址栏中的参数
var isc=new iScroll("hotel_scroll"),
    param=getParam(),
    cityId=param.city_id,
    dateIn=param.date_in,
    dateOut=param.date_out,
    name=param.name,
    pageNo=1,     // 页次
    pageSize=5,   // 每页显示的记录数
    // ajax请求时传递给后台的参数列表
    POST={
    	cityId:cityId,
    	dateIn:dateIn,
    	dateOut:dateOut,
        pageNo:pageNo,
        pageSize:pageSize
    }
    if(name) POST.name=name;
// 显示、设置入住和离店日期
$("#date_in").val(dateIn);
$("#date_out").val(dateOut);
$("#inText").text(formatMonthDay(dateIn));
$("#outText").text(formatMonthDay(dateOut));

function init(){
    sendHttpToHotel();
    bindEvent();
}

function sendHttpToHotel(action){
	console.log(POST);
	// 请求列表页
	common.access_server("../server/hotel2.php",POST,function(data){
	    renderHotelToDom(data,action);
	})
}

// 渲染酒店信息
function renderHotelToDom(data,action){
    var $tipbox=$("#tipbox"),
        $container=$("#hotel_list"),
        $loadMore=$(".load_more");
    // 判断是否有信息
    if(data.errcode==1){
        $tipbox.css("display","block");
        $container.empty("");
        $loadMore.css("display","none");
    }else{
        $tipbox.css("display","none");
        var count=data.count,
            pages=Math.ceil(count/pageSize),
            html='',
            hotels=data.result.hotel_list;
        if(action) $container.empty();
        $("#counts").text(count);
        // 渲染数据
        $.each(hotels,function(i,obj){
             html+='<div class="hotel_rows">'
                       +'<a href="detail.html?city_id='+cityId+'&date_in='+$("#date_in").val()+'&date_out='+$("#date_out").val()+'&hotel_id='+obj.hotel_id+'&hotel_name='+encodeURI(obj.name)+'">'
                           +'<dl>'
                                /*+'<dt><img src='+obj.image+'></dt>'*/
                                +'<dt><img src=img/01.jpg></dt>'
                                +'<dd>'
                                     +'<h2>'+obj.name+'</h2>'
                                     +'<ul>'
                                         +'<li class="pf">4.5分</li>'
                                         +'<li>礼</li>'
                                         +'<li>促</li>'
                                         +'<li>返</li>'
                                     +'</ul>'
                                     +'<p>'+obj.stars+'</p>'
                                     +'<address>'+obj.addr+'</address>'
                                +'</dd>'
                                +'<dd>'+obj.low_price/100+'</dd>'
                           +'</dl>'
                        +'</a>'
                    +'</div>'
        })
        $(html).appendTo($container);
        // 判断是否显示加载更多，如果当前页
        if(POST.pageNo<pages){
            $loadMore.css("display","block");
        }else{
            $loadMore.css("display","none");
        }
        isc.refresh();
    }
}

// 绑定事件
function bindEvent(){
    $(".load_more").on("click",function(){
        POST.pageNo+=1;
        sendHttpToHotel();
    })
    // 触摸滑动时显示底部导航
    var startY=0,
        offsetY,
        $box=$("#hotel_scroll"),
        $ftnav=$("#ftnav"),
        $layer=$("#item_layer");

    $box.on("touchstart",function(event){
         startY=event.touches[0].clientY;
         offsetY=0;
    })
    
    $box.on("touchmove",function(event){
         offsetY=event.touches[0].clientY-startY;
    })
    
    $box.on("touchend",function(){
        if(offsetY<0){
           $ftnav.css({
               'height':"3.2rem",
               '-webkit-transition':'height 0.3s ease-in-out'
           })
        }else{
           $ftnav.css({
               'height':"0rem",
               '-webkit-transition':'height 0.3s ease-in-out'
           })
        }
    })

    $ftnav.on("click","a",function(){
        common.showMark();
        $layer.css({
            'height':"20rem",
            '-webkit-transition':'height 0.3s ease-in-out'
        })
        var index=$(this).index();
        $layer.children("div").eq(index).addClass("cur_layer").siblings().removeClass("cur_layer");
        $(this).addClass("cur_item").siblings().removeClass("cur_item");
    })
}

// 渲染排序方式
function getSort(){
    var sort={
        "all":"不限",
        "hotMax":"人气最高",
        "priceMin":"价格最低",
        "priceMax":"价格最高",
        "disMin":"距离最近"
    }
    var html='<ul>';
    $.each(sort,function(k,text){
        html+='<li id="'+k+'">'+
                   '<a href="javascript:void(0)">'
                        +'<b>'+text+'</b>'
                        +'<span onclick="selectSort(\''+k+'\')"></span>'
                   +'</a>'
              +'</li>';
    })
    html+='</ul>';
    $("#sort").html(html).children('li').eq(0).addClass("on");
}

// 隐藏弹出层
function hideLayer(){
   POST.pageNo=1;
   setTimeout(function(){
      common.hideMark();
      $("#item_layer").css({
          'height':'0',
          '-webkit-transition':"height 0.3s ease-in-out"
      })
   },500)
}

function selectSort(k){
    var $cur=$("#"+k);
    $cur.addClass("on").siblings().removeClass("on");
    k=k==="all"?-1:k;
    $("#order").val(k);
    hideLayer();
    // 重新做ajax请求
    POST.sortType=$("#order").val();
    sendHttpToHotel("order");
}
getSort();

// 渲染价格
function getPrice(){
    var price={
        "0":["不限",-100,-100],
        "1":["0-100",0,100],
        "2":["101-200",101,200],
        "3":["201-300",201,300],
        "4":["301-400",301,400],
        "5":["401-500",401,500],
        "6":["500以上",500,-100]
    },
    html=["<ul>"];
    $.each(price,function(key,arr){
         html.push('<li id="p'+key+'">',
                   '<a href="javascript:void(0)">',
                   '<b>'+arr[0]+'</b>',
                   '<span onclick="selectPrice('+key+','+arr[1]+','+arr[2]+')"></span>',
                   '</a>',
                   '</li>');
    })
    $("#price").html(html.join(""));
}

function selectPrice(k,min,max){
   var $cur=$("#p"+k);
   $cur.addClass("on").siblings().removeClass("on");
   if(min!=-100)min=min*100;
   if(max!=-100)max=max*100;
   $("#min").val(min);
   $("#max").val(max);
   hideLayer();
   POST.minPrice=$("#min").val();
   POST.maxPrice=$("#max").val();
   sendHttpToHotel("price");
}
getPrice();

// 渲染品牌
function getBrand(){
   var hotelBrands = {
           0:'不限',
           12:'喜来登',
           15:'如家',
           18:"万豪",
           35:"香格里拉",
           39:"速8",
           44:"莫泰168",
           48:"汉庭",
           49:"全季",
           50:"锦江之星",
           53:"里程",
           68:"桔子",
           110:"如家快捷",
           132:"7天",
           160:"布丁",
           168:"格林豪泰",
           286:"尚客优"
   }
   var html='<ul>';
   $.each(hotelBrands,function(k,text){
       html+='<li id="b'+k+'">'+
                  '<a href="javascript:void(0)">'
                       +'<b>'+text+'</b>'
                       +'<span onclick="selectBrand('+k+',\''+text+'\')"></span>'
                  +'</a>'
             +'</li>';
   })
   html+='</ul>';
   $("#brand").html(html).children('li').eq(0).addClass("on");
}

function selectBrand(k,text){
   var $cur=$("#b"+k);
   $cur.addClass("on").siblings().removeClass("on");
   k=k==0?-1:text;
   $("#brand").val(k);
   hideLayer();
   POST.brand=$("#brand").val();
   sendHttpToHotel("brand");
}
getBrand();

// 渲染星级
function getStar(){
   var stars = {
       "0":"不限",
       "2":"二星以下/经济型",
       "3":"三星",
       "4":"四星",
       "5":"五星"
   }
   var html='<ul>';
   $.each(stars,function(k,text){
       html+='<li id="s'+k+'">'+
                  '<a href="javascript:void(0)">'
                       +'<b>'+text+'</b>'
                       +'<span onclick="selectStar('+k+')"></span>'
                  +'</a>'
             +'</li>';
   })
   html+='</ul>';
   $("#star").html(html).children('li').eq(0).addClass("on");
}

function selectStar(k){
   var $cur=$("#s"+k);
   $cur.addClass("on").siblings().removeClass("on");
   k=k==0?-1:k;
   $("#star").val(k);
   hideLayer();
   POST.stars=$("#star").val();
   sendHttpToHotel("star");
}
getStar();

init();
