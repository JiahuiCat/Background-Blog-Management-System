$(function(){

    $("#zhuce").click(function(){
        var input = $(this).parent();
        var username = input.find("input[name='username']").val();
        var password = input.find("input[name='password']").val();
        var password2 = input.find("input[name='password2']").val();
        // if(username == "" && password == "" && password2 == ""){
        //     return false;
        // }
        $.ajax({
            url:"/api/register",
            type:"post",
            data:{
                username:username,
                password:password,
                password2:password2
            },
            success:function(data){
                console.log(data);
                if(data.code != "0"){//注册失败
                    input.append("<p class='bg-danger error'>" + data.message + "</p>");
                }else{
                    input.append("<p class='bg-success error'>" + data.message + "</p>");
                }
                hiddens();
            }
            
        })
    })


    $("#login").click(function(req,res){
        var input = $(this).parent();
        var username = input.find("input[name='username']").val();
        var password = input.find("input[name='password']").val();
        // if(username == "" && password == "" && password2 == ""){
        //     return false;
        // }
        $.ajax({
            url:"/api/login",
            type:"post",
            data:{
                username:username,
                password:password
            },
            success:function(data){
                console.log(data);
                if(data.code != "0"){//注册失败
                    input.append("<p class='bg-danger error'>" + data.message + "</p>");
                }else{
                    input.hide();
                    
                    // 信息部分
                    $(".userInfo").show().find("span").text(data.userInfo.username);
                    $(".userInfo").show().find("span").attr("data-id",data.userInfo.id);
                    if(!data.userInfo.isAdmin){
                        $(".userInfo h4").eq(0).hide();
                    }
                }
                hiddens();
            }
            
        })
    })

    // 退出登陆功能
    $("#out").click(function(){
        $.ajax({
            url:"/api/out",
            success:function(res){
                if(res.code == 0){
                    location.reload();
                }
            }
        })
    })

    function hiddens(){
        setTimeout(function(){
            $(".error").hide();
        },2000);
    }




})