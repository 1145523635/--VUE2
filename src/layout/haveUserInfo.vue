<!--
 * @Descripttion: 当前layout模块存在用户信息模块
 * @Author: 银河以北
 * @Date: 2021-06-10 19:37:28
 * @LastEditors: 银河以北
 * @LastEditTime: 2021-11-04 22:28:09
-->
<template>
  <div class="app-contianer">
    <div class="contianer">
      <!-- 头部 -->
      <div class="contianer-header">
        <div class="header">
          <Logo></Logo>
          <Menu></Menu>
          <Login></Login>
        </div>
      </div>

      <!-- 显示内容 -->
      <div class="contianer-main">
        <div class="main">
          <Main></Main>
        </div>
        <div>
          <!-- <UserInfo></UserInfo> -->
        </div>
      </div>
      <div class="container-footer">
        <Footer></Footer>
      </div>
    </div>
  </div>
</template>
<script>
import Logo from "./components/logo.vue"; //引入logo
import Menu from "./components/menu.vue"; //引入菜单
import Main from "./components/main.vue"; //引入展示框
import Login from "./components/login.vue"; //引入登录组件
import Footer from "./components/footer.vue"; //引入版权
import UserInfo from "./components/userInfo.vue"; //引入版权
export default {
  name: "LayoutUserInfo",
  components: {
    Logo,
    Menu,
    Main,
    Footer,
    Login,
    UserInfo,
  },
};
</script>
<style lang="scss" scoped>
.app-contianer {
  width: 100%;
  display: flex;
  justify-content: center;
  .contianer {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;

    .contianer-header {
      padding: 0, 10px, 10px, 10px;
      width: 100%;
      height: 60px;
      display: flex;
      justify-content: space-around;
      background: #fff;
      margin-bottom: 20px;
      z-index: 100;
      .header {
        min-width: 1380px;
        display: flex;
        justify-content: space-around;
        align-items: center;
        position: fixed;
        top: 0;
        backdrop-filter: saturate(180%) blur(20px);
        background-color: rgba(255, 255, 255, 0.82);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
      }
    }
    .contianer-main {
      width: 1200px;

      min-height: calc(100vh - 60px);
      display: flex;
      .main {
        width: calc(100% - 300px);
        margin-right: 20px;
      }
    }
    .container-footer {
      width: 100%;
      z-index: 0;
      background: #22292d;
    }
  }
}
</style>
