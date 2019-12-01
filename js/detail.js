$(function(){
    var pid = location.search.substring(4);
    var pro = phoneData.find(function(e){
        return e.pID == pid;
    })

    $('.preview-img>img').attr('src',pro.imgSrc);
    $('.summary-price em').text(pro.price);
    $('.sku-name').text(pro.name)
    //获取本地存储数据
    var localproduct = JSON.parse(localStorage.getItem('localproduct'));
    
    if(localproduct===null){
        localproduct = [];
    }


    //加入购物车
    $('.addshopcar').on('click',function(){
        //输入判断
        var number = $('.choose-number').val();
        
        if(number.trim().length == 0 || isNaN(number) || number <=0){
            alert('请输入正确的数量');
           
        }

        //将字符串转为整数
        number = parseInt(number);
        //将数据加入本地存储
        var obj = {
            isChecked: true,
            pID: pro.pID,
            name: pro.name,
            price: pro.price,
            imgSrc: pro.imgSrc,
            number: number,
        };
        
        //先判断本地存储中是否已经存在此商品
        var sta = localproduct.find(function(e){
            return e.pID == pro.pID;
        })
        
       
        console.log(sta)
        if(sta){//如果存在则数量加
            sta.number += number;
        }else{
            localproduct.push(obj);
        }
        //再存入本地存储
        var josn = JSON.stringify(localproduct);
        localStorage.setItem('localproduct',josn);
        location.href = './cart.html';
    })
})