<!--
 * @Descripttion: 
 * @Author: 银河以北
 * @Date: 2021-06-12 16:44:04
 * @LastEditors: 银河以北
 * @LastEditTime: 2021-11-07 18:50:12
-->
<template>
  <div class="app-container">
    <div class="contaier">
      <!-- 头部图片 -->
      <div class="header">
        <img
          class="header-img"
          :src="userInfoBackground"
          :alt="userInfoBackground"
        />
      </div>
      <!-- 用户基本信息 -->
      <div class="user-info">
        <!-- 用户头像 -->
        <div class="user-avatar">
          <div class="avatar">
            <img
              class="avatar-img"
              :src="$utils.imgUrl(userInfoAvatar, isNetImg)"
              alt="用户头像"
            />
          </div>
        </div>
        <!-- 用户名称 -->
        <div class="user-name">
          <span>{{ userNickname }}</span>
        </div>
        <UserOtherInfo
          :otherInfo="otherInfo"
          v-if="isHaveInfo"
        />
      </div>

      <!-- 用户登录 -->
      <div class="user-login">
        <div class="login-btn">
          <div v-if="!havaUserInfo">
            <el-button
              type="primary"
              icon="el-icon-right"
              size="mini"
              @click="login"
            >登录</el-button>
            <el-button
              type="success"
              icon="el-icon-user"
              size="mini"
              @click="register"
            >注册</el-button>
          </div>
          <div
            v-else
            class="operation-options"
          >
            <el-button
              type="primary"
              icon="el-icon-star-off"
              size="mini"
              @click="toUserInfo"
              style="height:28px"
            >个人中心</el-button>
            <el-button
              type="success"
              icon="el-icon-document"
              size="mini"
              v-show="nowRoutePath!='/release'"
              @click="toWriteArticle"
              style="height:28px"
            >写文章</el-button>
            <el-button
              ref="infoBtn"
              type="warning"
              size="mini"
              style="margin-left:0;height:28px;"
              v-show="nowRoutePath!='/materialRecommend'"
              @click="toMaterialRecommend"
            ><i
                class="el-icon-share"
                ref="infoIcon"
              ></i>
              资源分享</el-button>
            <el-popover
              placement="bottom"
              title="消息通知"
              width="250"
              trigger="click"
            >
              <div
                class="websocket-container"
                v-if="socketInfo.length > 0"
              >
                <div
                  class="info-websocket"
                  v-for="(item, index) in socketInfo"
                  :key="index"
                  @click="toNoticeDetails(item)"
                >
                  <div>
                    <p class="item-notice">{{ item.notice }}</p>
                  </div>
                  <div>
                    <p class="item-time">
                      {{ $utils.getPastTimes(item.create_time) }}
                    </p>
                  </div>
                </div>
              </div>
              <div
                v-else
                @click="toNoticePage"
                class="websocket-emty"
              >
                <img
                  :src="notInfoImg"
                  width="100%"
                  alt=""
                />
                <p class="not-info-title">现在没有消息通知你呢</p>
              </div>
              <div slot="reference">
                <el-badge
                  :value="socketInfo.length"
                  class="item"
                  :hidden="socketInfo.length == 0"
                >
                  <el-button
                    ref="infoBtn"
                    type="warning"
                    size="mini"
                    @mouseover.native="mouseoverInfoBtn"
                    @mouseleave.native="mouseLeaveInfoBtn"
                    style="background: #ffd90c; border-color: #ffd90c;height:28px"
                  ><i
                      class="el-icon-message-solid"
                      ref="infoIcon"
                    ></i>
                    消息通知</el-button>
                </el-badge>

              </div>
            </el-popover>
          </div>
        </div>
      </div>
      <!-- hitokoto -->
      <div
        class="hitokoto"
        @click="configData"
      >
        <p class='hitokoto-container'>{{hitokoto.hitokoto}} </p>
        <p>『 <span v-if='hitokoto.from'>{{hitokoto.from}}</span><span v-else>--</span> 』-- <span v-if='hitokoto.from_who'>{{hitokoto.from_who}} </span><span v-else>未知</span></p>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import base from "@/config/defaultSettings";
import UserOtherInfo from "@/components/userOtherInfo/index.vue";
import { getHitokoto } from "@/utils/hitokoto";
export default {
  name: "UserInfo",
  components: {
    UserOtherInfo,
  },
  data() {
    return {
      //用户背景
      userInfoBackground: require("@/assets/user/userInfo.png"),

      //用户默认头像
      userInfoAvatar: require("@/assets/user/user-avatar.png"),

      //判断是否是本地图片
      isNetImg: true,

      //用户名
      userNickname: "未登录",

      //判断是否存在用户信息 || 用户登录
      havaUserInfo: false,

      //当前路由  用来控制写文章按钮的显示、隐藏
      nowRoutePath: true,

      //长链接心跳计时器
      socketTimer: null,

      //长链接对象
      socket: null,

      //长链接发送的消息
      socketInfo: [],

      //没有数据图片
      notInfoImg: require("@/assets/notData/notInfo.png"),

      //用户其他信息（文章、关注、粉丝）
      otherInfo: {},

      //判断是否需要渲染UserOtherInfo组件
      isHaveInfo: false,

      //hitokoto 内容
      hitokoto: {},
    };
  },
  created() {
    this.configData();
    if (this.userInfo && this.userInfo.user.avatar_url != undefined) {
      this.havaUserInfo = true;
      this.isNetImg = false;
      this.userNickname = this.userInfo.user.nickname;
      this.userInfoAvatar = this.userInfo.user.avatar_url;
      this.isHaveInfo = true;
      this.otherInfo = Object.assign({}, this.userInfo.other);
    } else {
      this.isHaveInfo = false;
    }
  },
  mounted() {
    this.initWebSocket();
    if (this.socketInfo.length > 0) {
      this.$refs.infoIcon.classList.add("info-btn");
    }
  },

  methods: {
    configData() {
      getHitokoto().then((res) => {
        this.hitokoto = Object.assign({}, res);
      });
    },

    initWebSocket() {
      //没有用户信息不执行
      if (!this.userInfo) {
        return;
      }
      //初始化链接
      this.socket = new WebSocket(base.websocketUrl);
      this.socket.onopen = this.socketOpen;
      this.socket.onerror = this.socketOnerror;
      this.socket.onmessage = this.socketOnmessage;
    },
    /* 发送消息 */
    socketSend() {
      const data = {
        type: "text",
        toUserId: 1,
        content: this.input,
      };
      this.socket.send(JSON.stringify(data));
    },
    /* 接收消息 */
    socketOnmessage(data) {
      const info = JSON.parse(data.data);
      if (Array.isArray(info)) {
        this.socketInfo = info;
      }
      if (info.type == 1) {
        this.socketInfo.unshift(info);
      }
      this.mouseLeaveInfoBtn();
    },
    /* 连接成功 */
    socketOpen() {
      const data = {
        userId: this.userInfo.user.id,
        type: "bind",
        content: "初次连接",
      };

      this.socket.send(JSON.stringify(data));
    },
    /* 连接失败 */
    socketOnerror(e) {
      console.log("连接失败", e);
    },
    /* 关闭连接 */
    socketOnclose(e) {
      console.log("关闭连接", e);
    },
    mouseoverInfoBtn() {
      this.$refs.infoIcon.classList.remove("info-btn");
    },
    mouseLeaveInfoBtn() {
      if (this.socketInfo.length > 0) {
        this.$refs.infoIcon.classList.add("info-btn");
      }
    },

    //去消息详情
    toNoticeDetails({ type, id }) {
      const USERID = this.$store.getters.userId;
      this.$store.commit("SET_VISITOR_ID", USERID);
      const VISITORID = this.$store.getters.visitorId;
      if (type == 1 || type == 2) {
        this.$router.push({
          path: `/userInfo/${VISITORID}/articleNews`,
          query: {
            id,
          },
        });
      }
    },
    //去消息页面 不带参数
    toNoticePage() {
      const USERID = this.$store.getters.userId;
      this.$store.commit("SET_VISITOR_ID", USERID);
      const VISITORID = this.$store.getters.visitorId;
      this.$router.push({
        path: `/userInfo/${VISITORID}/articleNews`,
      });
    },
    login() {
      this.$Login("login");
    },

    register() {
      this.$Login("register");
    },
    toUserInfo() {
      const USERID = this.$store.getters.userId;
      this.$store.commit("SET_VISITOR_ID", USERID);
      const VISITORID = this.$store.getters.visitorId;
      this.$router.push({
        path: `/userInfo/${VISITORID}/releaseList`,
        query: {
          activeArticleType: 1,
        },
      });
    },
    toWriteArticle() {
      this.$router.push("/release");
    },
    toMaterialRecommend() {
      this.$router.push("/materialRecommend");
    },
  },
  computed: {
    ...mapGetters(["userInfo"]),
  },
  watch: {
    userInfo(newVal) {
      if (newVal) {
        this.isNetImg = false;
        this.havaUserInfo = true;
        this.userNickname = newVal.user.nickname;
        this.userInfoAvatar = newVal.user.avatar_url;
        this.isHaveInfo = true;
        this.otherInfo = Object.assign({}, this.userInfo.other);
      } else {
        this.isNetImg = true;
        this.havaUserInfo = false;
        this.userNickname = "未登录";
        this.isHaveInfo = false;
        this.userInfoAvatar = require("@/assets/user/user-avatar.png");
      }
    },
    //监听路由 控制发布文章的显示 隐藏
    $route: {
      handler: function (to) {
        this.nowRoutePath = to.path;
      },
      immediate: true,
    },
  },
};
</script>
<style lang="scss" scoped>
.app-container {
  width: 300px;
  display: flex;
  z-index: 0;
  justify-content: center;
  .contaier {
    width: 300px;
    border-radius: 10px;
    overflow: hidden;
    height: 500px;
    background: #fff;
    .header {
      width: 100%;
      height: 200px;
      .header-img {
        width: 100%;
        height: 100%;
      }
    }
    .user-info {
      width: 100%;
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      position: relative;
      margin-bottom: 20px;
      .user-avatar {
        position: absolute;
        top: -50px;
        width: 100%;
        display: flex;
        justify-content: center;
        .avatar {
          width: 100px;
          height: 100px;
          overflow: hidden;
          border-radius: 50%;
          border: 1px solid #00a2e3;
          .avatar-img {
            width: 100%;
            height: 100%;
            transition: 1s;
            cursor: pointer;
          }
          .avatar-img:hover {
            transform: rotate(360deg) scale(1.5);
          }
        }
      }
      .user-name {
        width: 100%;
        margin-top: 70px;
        font-weight: 600;
      }
    }
    .user-login {
      width: 100%;
      display: flex;
      justify-content: center;
      .operation-options {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        width: 100%;
        button {
          margin-bottom: 5px;
          margin-right: 5px;
        }
        .info-btn {
          animation: rock 1s 0s ease-in-out infinite;
        }
        @keyframes rock {
          0% {
            -webkit-transform: rotate(0);
            transform: rotate(0);
            font-size: 12px;
          }
          10% {
            -webkit-transform: rotate(-15deg);
            transform: rotate(-15deg);
            font-size: 12px;
          }
          20% {
            -webkit-transform: rotate(-30deg);
            transform: rotate(-30deg);
            font-size: 14px;
          }
          30% {
            -webkit-transform: rotate(-45deg);
            transform: rotate(-45deg);
            font-size: 16px;
          }
          35% {
            -webkit-transform: rotate(-15deg);
            transform: rotate(-15deg);
            font-size: 12px;
          }
          40% {
            -webkit-transform: rotate(-45deg);
            transform: rotate(-45deg);
            font-size: 16px;
          }
          45% {
            -webkit-transform: rotate(-15deg);
            transform: rotate(-15deg);
            font-size: 12px;
          }
          50% {
            -webkit-transform: rotate(-30deg);
            transform: rotate(-30deg);
            font-size: 14px;
          }
          100% {
            -webkit-transform: rotate(0);
            transform: rotate(0);
            font-size: 12px;
          }
        }
      }
    }
    .hitokoto {
      padding: 10px;
      width: calc(100% - 20px);
      margin-top: 20px;
      font-size: 12px;
      color: rgb(177, 177, 177);
      cursor: pointer;
    }
  }
}
.websocket-container {
  background: #f5f6f7;
  width: calc(100% - 6px);
  max-height: 180px;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 5px;
  /* 滚动条样式 */
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: rgba(144, 147, 153, 0.3);
    border-radius: 5px;
  }
  &::-webkit-scrollbar-track {
    background-color: #f0f2f5;
  }
  &::-webkit-scrollbar-thumb:hover {
    background-color: rgba(144, 147, 153, 0.6);
  }
  &::-webkit-scrollbar-thumb:active {
    background-color: rgba(144, 147, 153, 0.9);
  }
  .info-websocket {
    width: calc(100% - 10px);
    cursor: pointer;

    .item-time {
      width: 100%;
      text-align: right;
      font-size: 12px;
      color: #999;
    }
    .item-notice {
      width: 100%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
.websocket-emty {
  cursor: pointer;
}
.not-info-title {
  width: 100%;
  text-align: center;
  font-size: 12px;
  color: #999;
}
</style>