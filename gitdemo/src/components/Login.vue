<template>
    <body id="poster">
    <el-form class="login-container" label-position="left"
             label-width="0px">
        <h3 class="login_title">GIT登录</h3>
        <el-form-item>
            <el-input type="text" v-model="giturl"
                      auto-complete="off" placeholder="git地址"></el-input>
        </el-form-item>
        <el-form-item>
            <el-input type="password" v-model="tokens"
                      auto-complete="off" placeholder="Access Tokens"></el-input>
        </el-form-item>
        <el-form-item style="width: 100%">
            <el-button type="primary" style="width: 100%;background: #505458;border: none" v-on:click="login">登录</el-button>
        </el-form-item>

        <el-form-item style="margin-top:-10px;margin-bottom:-5px;" >
            <el-checkbox v-model="checked" style="color:#a0a0a0;margin-top:-10px;">记住密码</el-checkbox>
        </el-form-item>



    </el-form>
    </body>
</template>

<script>

    const key = 'updatable';

    let apiurl='api/v4/projects?membership=true&per_page=100'
    export default {
        name: 'Login',
        data () {
            return {
                    giturl: '',
                    tokens: '',
                checked: false,
                responseResult: [],


            }
        },

        methods: {
            login () {
                let that=this
                localStorage.setItem('giturl',this.giturl),
                localStorage.setItem('tokens',this.tokens)

                this.$http.get(this.giturl + apiurl + '&private_token=' + this.tokens).then((response) => {
                    that.projects = response.data;
                    setTimeout(this.openMessage,0)

                    localStorage.setItem('projects',JSON.stringify(that.projects))

                    //保存的账号
                    var url=this.giturl;
                    //保存的密码
                    var tokens=this.tokens;
                    if(this.checked=true){
                        //传入账号名，密码，和保存天数3个参数
                        this.setCookie(url,tokens,365);
                    }


                },(response)=>{
                    if(response.status===401||response.status===404){
                        setTimeout(that.openMessagee)
                    }
                })

            },

            openMessage() {
                this.$message.success('登陆成功');
                this.$router.push({
                    name: 'demo',
                })
            },
            openMessagee() {
                this.$message.error('登陆失败');
            },
            //设置cookie
            setCookie(c_name,c_pwd,exdays) {
                var exdate=new Date();//获取时间
                exdate.setTime(exdate.getTime() + 24*60*60*1000*exdays);//保存的天数
                //字符串拼接cookie
                window.document.cookie="userName"+ "=" +c_name+";path=/;expires="+exdate.toGMTString();
                window.document.cookie="userPwd"+"="+c_pwd+";path=/;expires="+exdate.toGMTString();
            },
            //读取cookie
            getCookie:function () {
                if (document.cookie.length>0) {
                    var arr=document.cookie.split('; ');//这里显示的格式需要切割一下自己可输出看下
                    for(var i=0;i<arr.length;i++){
                        var arr2=arr[i].split('=');//再次切割
                        //判断查找相对应的值
                        if(arr2[0]=='userName'){
                            this.giturl=arr2[1];//保存到保存数据的地方
                        }else if(arr2[0]=='userPwd'){
                            this.tokens=arr2[1];
                        }
                    }
                }
            },




        },
        mounted(){
            this.getCookie()
        }


    }
</script>

<style>
    #poster {
        background:url("../assets/InkCloud.jpg") no-repeat;
        background-position: center;
        height: 100%;
        width: 100%;
        background-size: cover;
        position: fixed;
    }
    body{
        margin: 0px;
    }
    .login-container {
        border-radius: 15px;
        background-clip: padding-box;
        margin: 90px auto;
        width: 350px;
        padding: 35px 35px 15px 35px;
        background: #fff;
        border: 1px solid #eaeaea;
        box-shadow: 0 0 25px #cac6c6;
    }
    .login_title {
        margin: 0px auto 40px auto;
        text-align: center;
        color: #505458;
    }

</style>
