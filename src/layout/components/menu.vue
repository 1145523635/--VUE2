<!--
 * @Descripttion: 
 * @Author: 银河以北
 * @Date: 2021-06-10 19:58:57
 * @LastEditors: 银河以北
 * @LastEditTime: 2021-10-27 20:06:51
-->
<template>
  <div class="app-container">
    <div class="container">
      <div class="menu-list">
        <keep-alive
          v-for="(item, index) in menuList"
          :key="index"
        >
          <router-link
            :to="item.path"
            tag="div"
            class="menu-item"
            :class="{
              'active-menu': activeMenu == item.id || activePath == item.path,
            }"
            @mouseover="activeMenu = item.id"
            @mouseleave="activeMenu = 0"
          >
            <span>{{ item.name }}</span>
          </router-link>
        </keep-alive>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "Menu",
  data() {
    return {
      //菜单列表
      menuList: [
        {
          id: 1,
          name: "资源推荐",
          path: "/home",
        },
        {
          id: 2,
          name: "妙笔生花",
          path: "/resources",
        },
        {
          id: 3,
          name: "奇思妙想",
          path: "/achievements",
        },
      ],

      //活动路由
      activeMenu: 0,
      activePath: "/",
    };
  },
  created() {
    const sonMenu = ["Personal", "Collection", "Comment", "Follow", "Release"];
    if (sonMenu.includes(this.$route.name)) {
      this.activePath = undefined;
    } else {
      this.activePath = this.$route.path;
    }
  },
  watch: {
    //监听路由 动态改变样式
    $route(to) {
      this.activePath = to.path;
    },
  },
};
</script>
<style lang="scss" scoped>
.app-container {
  display: flex;
  width: 980px;
  height: 100%;
  .container {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: 100%;
    .menu-list {
      display: flex;
      height: 100%;
      margin-right: 20px;
      .menu-item {
        width: 100px;
        line-height: 60px;
        height: 100%;
        position: relative;
        cursor: pointer;
      }
      .menu-item:hover .active-men {
        display: block;
      }
      .active-menu {
        color: #00a2e3;
      }
      .active-menu::before {
        content: " ";
        position: absolute;
        width: 100%;
        background: #00a2e3;
        height: 5px;
        border-radius: 0 0 15px 15px;
        left: 0;
      }
    }
  }
}
</style>
