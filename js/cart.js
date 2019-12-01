$(function(){
    var html = '';
    //获取本地数据
    var localproduct = JSON.parse(localStorage.getItem('localproduct'));
    if(localproduct === null){
        localproduct = [];
    }else{
        $('.empty-tip').css('display','none');
        $('.cart-header').show();
        $('.total-of').show();
    }
    //生成数据列表
    localproduct.forEach(e=>{
        html += `<div class="item" data-id="${e.pID}">
                <div class="row">
                <div class="cell col-1 row">
                    <div class="cell col-1">
                    <input type="checkbox" class="item-ck" checked="">
                    </div>
                    <div class="cell col-4">
                    <img src="${e.imgSrc}" alt="">
                    </div>
                </div>
                <div class="cell col-4 row">
                    <div class="item-name">${e.name}</div>
                </div>
                <div class="cell col-1 tc lh70">
                    <span>￥</span>
                    <em class="price">${e.price}</em>
                </div>
                <div class="cell col-1 tc lh70">
                    <div class="item-count">
                    <a href="javascript:void(0);" class="reduce fl ">-</a>
                    <input autocomplete="off" type="text" class="number fl" value="${e.number}">
                    <a href="javascript:void(0);" class="add fl">+</a>
                    </div>
                </div>
                <div class="cell col-1 tc lh70">
                    <span>￥</span>
                    <em class="computed">${e.price*e.number}</em>
                </div>
                <div class="cell col-1">
                    <a href="javascript:void(0);" class="item-del">从购物车中移除</a>
                </div>
                </div>
            </div>`
    })
    $('.item-list').append(html);
    //
    // var nockall = localproduct.find(function(e){
    //     return e.isChecked;
    // })

   localproduct.forEach(function(e,i){
        //console.log(e)
        if(e.isChecked === false){
            $('.pick-all').prop('checked',false);
        }
        $('.item-ck').eq(i).prop('checked',e.isChecked);
   })
 
    //点击全选
    $('.pick-all').on('click',function(){
        var sta = $(this).prop('checked');
        $('.item-ck').prop('checked',sta);
        $('.pick-all').prop('checked',sta);
        //改变ischecked状态
       
        localproduct.forEach(function(e){
            e.isChecked = sta;
        })
        //覆盖本地存储
        var json = JSON.stringify(localproduct);
        localStorage.setItem('localproduct',json);
        calcTotal();
    })
    //点击单选，通过委托
    $('.item').on('click','.item-ck',function(){
        //改变点击的ischecked
        var ckall = $('.item-ck').length === $('.item-ck:checked').length;//如果选择数量与可选数量相同则为全选
        $('.pick-all').prop('checked',ckall);
        //获得当前pid
        var pid = $(this).parents('.item').attr('data-id');
        var sta = $(this).prop('checked');
        //将当前pid数据的状态附加到本地缓存
        localproduct.forEach(function(e){
            if(e.pID == pid){
                e.isChecked = sta;
            }
        })
        var json = JSON.stringify(localproduct);
        localStorage.setItem('localproduct',json);
        calcTotal();
    })
    //计算总价格和总件数
    function calcTotal(){
        var count = 0;
        var money = 0;
        localproduct.forEach(function(e){
            if(e.isChecked){
                count += e.number;
                money += e.number*e.price;
            }
        }) 
        $('.selected').text(count);
        $('.total-money').text(money);
    }
    calcTotal();

    //点击加号
    $('.item-list').on('click','.add',function(){
        var count = $(this).prev().val();
        count++;
        $(this).prev().val(count);
        //修改更新的数据
        var pid = $(this).parents('.item').attr('data-id');
        var current;
        localproduct.forEach(function(e){
            
            if(e.pID == pid){
                e.number = count;
                return current = e;              
            }
        })
        //
        var json = JSON.stringify(localproduct);
        localStorage.setItem('localproduct',json)
        //更新总价格和数量
        calcTotal();
        //改变右边的价格  find('后代')找到满足条件的子元素
        $(this).parents('.item').find('.computed').text(current.number*current.price);
    })
    //点击减号
    $('.item-list').on('click','.reduce',function(){
        var count = $(this).next().val();
        if(count <= 1){
            alert('商品数量不能小于1');
            return;
        }
        count--;
        
        $(this).next().val(count);
        //当前标志
        var pid = $(this).parents('.item').attr('data-id');
        //更新本地数据
        var current;
        localproduct.forEach(function(e){
            if(e.pID == pid){
                //保存输入的数量
                e.number = count;
                return current = e;
            }
        })
        var json = JSON.stringify(localproduct);
        localStorage.setItem('localproduct',json);

        //重新计算价格
        calcTotal();
        $(this).parents('.item').find('.computed').text(current.number*current.price);
    })
    //保存手动输入前的商品数量
    $('.item-list').on('focus','.number',function(){
        var number = $(this).val();
        $(this).attr('data-old',number);
    })
    //手动输入商品数量
    $('.item-list').on('blur','.number',function(){
        var count = $(this).val();
        //分开转换
        count = parseInt(count);
        // console.log(count);
        //如果输入的不是数字或者是负数
        if(!(/^\d{1,}$/.test(count)) || count <= 0){
            var old = $(this).attr('data-old');
            $(this).val(old);
            alert('请输入正确的商品数量哦');
            return;
        }
        // 当前商品的pid
        
        var pid = $(this).parents('.item').attr('data-id');
        // 更新数据
        var current;
        localproduct.forEach(function(e){
            if(e.pID == pid){
                //保存输入的数量
                e.number = count;
                return current = e;
            }
        })
        // console.log(current)
        var json = JSON.stringify(localproduct);
        localStorage.setItem('localproduct',json);
        //重新计算价格
        calcTotal();
        $(this).parents('.item').find('.computed').text(current.number*current.price);
    })
    //删除选中的商品
    $('.item-list').on('click','.item-del',function(){
        layer.confirm('你确定要删除吗?', {icon: 0, title:'警告'}, (index)=>{
            layer.close(index);
            // 得到要删除的数据的id
            let pid = $(this).parents('.item').attr('data-id');
            // 把当前点击的这个删除对应的这一行删掉
            $(this).parents('.item').remove();
            // 把本地存储里面的当条数据删除
            localproduct.forEach(function(e,i){
                if(e.pID == pid){
                    localproduct.splice(i,1);
                }
            })
            //更新数据
            var json = JSON.stringify(localproduct);
            localStorage.setItem('localproduct',json);      
            calcTotal();
          });
    })
})