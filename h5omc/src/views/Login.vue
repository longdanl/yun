<template>
  <div class="login">
    <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-position="left" label-width="0px" class="demo-ruleForm login-container">
      <div class="loginTitle">客服视频彩铃</div>
      <div class="loginBox">
        <div class="social-title">管理系统</div>
        <div class="borderBottom1"></div>
      </div>
      <el-form-item prop="account">
        <el-input prefix-icon="el-icon-s-custom" type="text" v-model="ruleForm2.username" auto-complete="off" placeholder="账号"></el-input>
      </el-form-item>
      <el-form-item prop="checkPass">
        <el-input prefix-icon="el-icon-unlock" type="password" v-model="ruleForm2.password" auto-complete="off" placeholder="密码" show-password></el-input>
      </el-form-item>
      <el-form-item style="width:100%;">
        <el-checkbox v-model="checked" style="color:#656766;float: left">记住密码</el-checkbox>
        <el-button class="forgetBtn" type="text" @click="forgetPwd">忘记密码?</el-button>
      </el-form-item>
      <el-form-item style="width:100%;">
        <el-button style="width:100%;" type="primary" class="loginBtn" @click.native.prevent="handleSubmit2" :loading="logining">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  //导入自己封装的axios：
  import store from "../store"
  import request from '../utils/request';
  import qs from 'qs';
  import { getToken } from '../utils/auth'
  import {userDetail} from "../api/user"
  import CryptoJS from "crypto-js";
  export default {
    data() {
      return {
        logining: false,
        ruleForm2: {
          username: '',
          password: ''
        },
        rules2: {
          username: [
            { required: true, message: '请输入账号', trigger: 'blur' },
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
          ]
        },
        checked:false
      };
    },
    created() {
      //判断是否记住密码
      if (localStorage.getItem("checked") == 'true') {
        this.getCookie();
      }
    },
    methods: {
      forgetPwd(){
        this.$alert('请联系管理员进行密码找回！', {
          confirmButtonText: '确定',
        });
      },
      handleSubmit2(ev) {
        if(this.ruleForm2.username!=""&&this.ruleForm2.password!="") {
          this.logining = true;
          this.$store.dispatch('user/login', this.ruleForm2)
                  .then( async (response) => {
                    if(response.code==0){
                      await userDetail(getToken()).then((res) => {
                        let per = res.permissions;
                        sessionStorage.setItem('per', JSON.stringify(per));
                        this.$router.replace('/main')
                      });
                      if (this.checked == true) {
                        //判断用户是否勾选了记住密码选项rememberPsw，传入保存的账号currentPortId，密码password，天数7
                        this.setCookie(this.ruleForm2.username,this.ruleForm2.password,7);
                      }else{
                        this.clearCookie();
                      }
                      //这里是因为要在created中判断，所以使用了localstorage比较简单。
                      localStorage.setItem("checked", this.checked);
                      this.logining = false;
                      this.$message({
                        message: '登录成功',
                        type: 'success'
                      });
                    }else{
                      this.logining = false;
                      this.$message({
                        message:response.description,
                        type: 'error'
                      });
                    }
                  })
        }else {
          this.$message({
            message: '请输入用户名和密码！',
            type: 'error'
          });
        }
      },
      setCookie(username, psw, exdays) {
        //加密账号密码
        let cipherPortId
        if(typeof(username) === "string"){
          cipherPortId = CryptoJS.AES.encrypt(username, "secretkey123");
        }else{
          cipherPortId = CryptoJS.AES.encrypt(username+"", "secretkey123").toString();
        }
        var cipherPsw = CryptoJS.AES.encrypt(psw+'', "secretkey123").toString();
        var exdate = new Date(); //获取时间
        exdate.setTime(exdate.getTime() + 24 * 60 * 60 * 1000 * exdays); //保存的天数
        //字符串拼接cookie，为什么这里用了==，因为加密后的字符串也有个=号，影响下面getcookie的字符串切割。
        window.document.cookie =
                "currentPortId" +
                "==" +
                cipherPortId +
                ";path=/;expires=" +
                exdate.toGMTString();
        window.document.cookie =
                "password" +
                "==" +
                cipherPsw +
                ";path=/;expires=" +
                exdate.toGMTString();
      },
      //读取cookie
      getCookie: function() {
        if (document.cookie.length>0) {
          var arr = document.cookie.split("; "); //这里显示的格式请根据自己的代码更改
          for (var i = 0; i < arr.length; i++) {
            var arr2 = arr[i].split("=="); //根据==切割
            //判断查找相对应的值
            if (arr2[0] == "currentPortId") {
              // Decrypt，将解密后的内容赋值给账号
              var bytes = CryptoJS.AES.decrypt(arr2[1], "secretkey123");
              this.ruleForm2.username = bytes.toString(CryptoJS.enc.Utf8);
            } else if (arr2[0] == "password") {
              // Decrypt，将解密后的内容赋值给密码
              var bytes = CryptoJS.AES.decrypt(arr2[1], "secretkey123");
              this.ruleForm2.password = bytes.toString(CryptoJS.enc.Utf8);
            }
          }
        }
      },
      //清除cookie
      clearCookie: function() {
        this.setCookie("", "", -1);
      }
    }
  }
</script>
<style lang="scss">
  ::-ms-clear,::-ms-reveal{display:none;}
  .login {
    height: 100%;
    width: 100%;
    background-image: url("../assets/bg2.jpg");
    background-repeat: no-repeat;
    background-size: 100%;
  .login-container {
    position: absolute;
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    left: 50%;
    top:50%;
    margin-left: -180px;
    margin-top: -210px;
    width: 300px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
  .logo,.loginTitle,.loginBox {
    margin: 0px auto 20px auto;
    text-align: center;
    color: #505458;
  }
  .loginTitle{
    font-family:宋体;
    color:#505458;
    font-size: 26px;
  }
  .loginBox div{
    font-family:宋体;
    color:gray;
    margin-bottom: 20px;
    font-size: 20px;
  }
  .loginBox .borderBottom1{
    border-bottom: 1px solid #ccc;
  }
  .forgetBtn {
    border: 0;
    float: right;
    font-size: 15px;
    color: #505458;
  }
  .forgetBtn:hover {
    text-decoration :underline;
  }
  .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner {
    background-color:#409EFF;
    border-color:#409EFF;
  }
  .el-checkbox__input.is-checked+.el-checkbox__label {
    color:#409EFF;
  }
  }
  }
</style>
