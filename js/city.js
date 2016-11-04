var Alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'W', 'X', 'Y', 'Z'];
var isc=new iScroll("container");
function init(){
   renderHotCity();
   renderCity();
   $("#cur_city").text(localStorage.getItem("cityName"));
   $("#return").click(function(){
       $(this).attr("href","../index.html?city_id="+localStorage.getItem("cityId")+'&city_name='+localStorage.getItem("cityName"))
   })
}

// 渲染热门城市
function renderHotCity(){
	$.ajax({
		url:"../server/hotCity.json",
		type:"get",
		dataType:"json",
		success:function(data){
			renderDataToDom(data);
		},
		error:function(){

		}
	})
}

function renderDataToDom(data){
    var html='';
    $.each(data,function(k,text){
        html+='<li>'
                +'<a href="../index.html?city_id='+k+'&city_name='+encodeURI(text)+'">'+text+'</a>'
             +'</li>';
    })
    $("#hot_city").html(html);
    isc.refresh();
}

// 渲染城市
function renderCity(){
    var s,list='',html='';
    $("#cur_city").text(localStorage.getItem("cityName"));
    for(var i=0,len=Alphabet.length;i<len;i++){
       s=Alphabet[i];
       list+='<li>'
                 +'<a href="#city'+i+'">'+s+'</a>'
            +'</li>';
       // 拼接城市列表
       html+='<div id="city'+i+'">'
                +'<div class="tipbg">'+s+'</div>'
                +'<ul>';
       // 找出所有以s开头的城市
       $.each(CITIES,function(k,arr){
           if(arr[1].charAt(0)==s){
               html+='<li>'
                        +'<a href="../index.html?city_id='+k+'&city_name='+encodeURI(arr[0])+'">'+arr[0]+'</a>'
                   +'</li>';
           }
       })
       html+='</ul></div>';
       $("#city_box").html(html);
    }
    $("#more_list").html(list);
    isc.refresh();
}

init();