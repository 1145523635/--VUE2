<!--
 * @Descripttion: 
 * @Author: 银河以北
 * @Date: 2021-09-14 21:11:13
 * @LastEditors: 银河以北
 * @LastEditTime: 2021-10-26 08:37:15
-->
<template>
  <div class="app-container">
    <div class="other-item">
      <el-tooltip
        effect="dark"
        :content="otherInfo.articleNum.label"
        placement="bottom"
      >
        <el-tag
          size="mini"
          class="el-icon-document"
          type=""
          effect="dark"
          @click="toArticleRelease"
        >
          {{ otherInfo.articleNum.value }}</el-tag>
      </el-tooltip>
    </div>
    <div class="other-item">
      <el-tooltip
        effect="dark"
        :content="otherInfo.articleFollowNum.label"
        placement="bottom"
      >
        <el-tag
          size="mini"
          class="el-icon-collection-tag"
          type="success"
          effect="dark"
          @click="toArticleFollow"
        >
          {{ otherInfo.articleFollowNum.value }}</el-tag>
      </el-tooltip>
    </div>
    <div class="other-item">
      <el-tooltip
        effect="dark"
        :content="otherInfo.material.label"
        placement="bottom"
      >
        <el-tag
          size="mini"
          class="el-icon-menu"
          type=""
          effect="dark"
          @click="toMaterialRecommend"
        >
          {{ otherInfo.material.value }}</el-tag>
      </el-tooltip>
    </div>
    <div class="other-item">
      <el-tooltip
        effect="dark"
        :content="otherInfo.followNum.label"
        placement="bottom"
      >
        <el-tag
          size="mini"
          class="el-icon-star-off"
          type="warning"
          effect="dark"
          @click="toUserFollow(true)"
        >
          {{ otherInfo.followNum.value }}</el-tag>
      </el-tooltip>
    </div>
    <div class="other-item">
      <el-tooltip
        effect="dark"
        :content="otherInfo.fansNum.label"
        placement="bottom"
      >
        <el-tag
          size="mini"
          class="el-icon-magic-stick"
          type="danger"
          effect="dark"
          @click="toUserFollow(false)"
        >
          {{ otherInfo.fansNum.value }}</el-tag>
      </el-tooltip>
    </div>
  </div>
</template>

<script>
export default {
  name: "UserOtherInfo",
  props: {
    otherInfo: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  methods: {
    //去文章发布页
    toArticleRelease() {
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

    //文章收藏页
    toArticleFollow() {
      const USERID = this.$store.getters.userId;
      this.$store.commit("SET_VISITOR_ID", USERID);
      const VISITORID = this.$store.getters.visitorId;
      this.$router.push({
        path: `/userInfo/${VISITORID}/collection`,
      });
    },

    //资源页
    toMaterialRecommend() {
      const USERID = this.$store.getters.userId;
      this.$store.commit("SET_VISITOR_ID", USERID);
      const VISITORID = this.$store.getters.visitorId;
      this.$router.push({
        path: `/userInfo/${VISITORID}/material`,
      });
    },

    //用户关注页
    toUserFollow(status = true) {
       const USERID = this.$store.getters.userId;
      this.$store.commit("SET_VISITOR_ID", USERID);
      const VISITORID = this.$store.getters.visitorId;
      this.$router.push({
        path: `/userInfo/${VISITORID}/follow`,
         query: {
          isFollow: status,
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.app-container {
  width: 100%;
  display: flex;
  justify-content: center;
  .other-item {
    margin: 5px;
    cursor: pointer;
  }
}
</style>