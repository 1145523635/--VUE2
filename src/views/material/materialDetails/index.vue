<!--
 * @Descripttion: 资源详情
 * @Author: 银河以北
 * @Date: 2021-10-14 22:26:19
 * @LastEditors: 银河以北
 * @LastEditTime: 2021-11-08 20:23:54
-->
<template>
  <div class='app-container'>
    <div class='container'>
      <el-card class="box-card">
        <div
          slot="header"
          class="clearfix"
        >
          <span class="recommend-title">资源详情</span>
        </div>
        <div class='material-container'>
          <div class='material-item'>
            <div class='img'>
              <img
                :src="$utils.imgUrl(materialData.material_cover)"
                alt="LOGO"
                height="100px"
              />
            </div>
          </div>
          <div class='material-item'>
            <div class='name'>
              {{materialData.material_name}}
            </div>
          </div>
          <div class='material-item'>
            <div class="browse">
              <el-tooltip
                class="item"
                effect="dark"
                content="浏览量"
                placement="top"
              >
                <el-tag
                  type="info"
                  size="small"
                  effect="dark"
                  class='tag'
                ><i class="el-icon-view icon"></i><span>{{materialData.browse_num}}</span></el-tag>
              </el-tooltip>
              <el-tooltip
                class="item"
                effect="dark"
                content="收藏"
                placement="top"
              >
                <el-tag
                  type="danger"
                  size="small"
                  effect="dark"
                  class='tag'
                  @click="addMaterialLinkNum()"
                ><i
                    class='el-icon-star-on icon'
                    v-if="isCollection"
                  ></i><i
                    class="el-icon-star-off icon"
                    v-else
                  ></i><span>{{materialData.like_num}}</span></el-tag>
              </el-tooltip>
              <el-tag
                size="small"
                effect="dark"
                class='tag'
                v-clipboard:copy="conyContainer"
                v-clipboard:success="onCopy"
              ><i class="el-icon-share icon"></i><span>分享</span></el-tag>
            </div>
          </div>
          <div class='material-item'>
            <div class='describe'>{{materialData.material_describe}}</div>
          </div>
          <div class='material-item'>
            <div class='type'>
              <el-tag
                v-for="(item,index) in materialData.typeId"
                size='small'
                effect="plain"
                style="margin-right:5px;color:#000;border-color:#d9d9d9"
              >{{item.typeName.material_name}}</el-tag>
            </div>
          </div>
          <el-divider></el-divider>
          <div class='material-other'>
            <div class='material-link'>
              <p>链接：<span>
                  <el-link
                    :href="materialData.material_link"
                    target="_blank"
                    type="primary"
                    style="margin-right:5px"
                  >{{materialData.material_link}}</el-link>
                </span>
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="copyLinkIcon?'已复制':'复制'"
                  placement="top"
                ><span
                    style="cursor: pointer;"
                    v-clipboard:copy="conyContainer"
                    v-clipboard:success="copyLink"
                    v-if='!copyLinkIcon'
                  ><i
                      class="el-icon-document-copy"
                      style="color:#409EFF"
                    ></i></span>
                  <span
                    style="cursor: pointer;"
                    v-else
                  ><i
                      class="el-icon-check"
                      style="color:#67C23A"
                    ></i></span>
                </el-tooltip>
              </p>
            </div>
            <div class='material-link'>
              <p>详情</span>：<span>{{materialData.material_details}}</span></p>
            </div>
            <div class='material-link'>
              <p>时间：<span>{{materialData.create_time}}</span></p>
            </div>
            <div class='material-link'>
              <div class='recommender'>
                <div>推荐人：</div>
                <div
                  class='user-info'
                  @click="toUserInfo(materialData.userInfo)"
                >
                  <div class='user-avatar'><img
                      :src="$utils.imgUrl(materialData.userInfo.avatar_url)"
                      alt="avatar"
                      style="width:100%;height:100px"
                    ></div>
                  <div>
                    <span>{{materialData.userInfo.nickname}}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import {
  getMaterialDetails,
  addMaterialBrowse,
  addMaterialLike,
  hasCollection,
} from "@/api/material/materialRecommend";
export default {
  name: "MaterialDetails",
  data() {
    return {
      //资源ID
      materialId: 0,

      //资源数据
      materialData: {
        userInfo: {},
      },

      //复制链接图标
      copyLinkIcon: false,

      //计时器
      timer: null,

      //判断用户是否关注
      isCollection: false,
    };
  },
  created() {
    this.materialId = this.$route.query.id;
    this.init();
  },
  methods: {
    //数据初始化
    init() {
      this.isCollection = false;
      getMaterialDetails({ id: this.materialId }).then((res) => {
        this.materialData = Object.assign({}, res.data);
        this.timer = setTimeout(() => {
          addMaterialBrowse({ id: res.data.id });
        }, 3000);
      });
      if (this.$store.getters.userInfo) {
        const query = {
          materialId: this.materialId,
          userId: this.$store.getters.userInfo.user.id,
        };
        hasCollection(query).then((res) => {
          this.isCollection = res.data;
        });
      }
    },

    //复制
    onCopy() {
      this.$message({
        message: "内容已成功复制到剪切板！",
        type: "success",
      });
    },

    //去用户中心，访客的
    toUserInfo(item) {
      const USERID = item.id;
      this.$store.commit("SET_VISITOR_ID", USERID);
      const VISITORID = this.$store.getters.visitorId;
      this.$router.push({
        path: `/userInfo/${VISITORID}/releaseList`,
        query: {
          activeArticleType: 1,
        },
      });
    },

    //复制链接
    copyLink() {
      this.copyLinkIcon = true;
      this.onCopy();
      setTimeout(() => {
        this.copyLinkIcon = false;
      }, 3000);
    },

    //增加收藏
    addMaterialLinkNum() {
      const query = {
        materialId: this.materialId,
        userId:
          this.$store.getters.userInfo && this.$store.getters.userInfo.user.id,
      };
      addMaterialLike(query).then((res) => {
        if (this.isCollection) {
          this.materialData.like_num--;
        } else {
          this.materialData.like_num++;
        }
        this.isCollection = !this.isCollection;
      });
    },
  },
  computed: {
    //剪切板内容
    conyContainer() {
      const text = `我在银河以北发现了『 ${this.materialData.material_name} 』,快来看看${this.materialData.material_link}`;
      return text;
    },
  },
};
</script>

<style lang="less" scoped>
@import "@/style/commonStyle.less";
.app-container {
  width: 100%;
  .container {
    width: 100%;
    .clearfix {
      text-align: left;
      .title-color-scroll-style();
      .recommend-title {
        font-weight: 800;
      }
    }
    .material-container {
      width: 100%;
      .material-item {
        width: 100%;
        display: flex;
        justify-content: center;
        .img {
          height: 100px;
          cursor: pointer;
        }
        .name {
          color: rgba(0, 0, 0, 0.85);
          font-weight: 500;
          font-size: 24px;
          letter-spacing: 1px;
          margin-bottom: 10px;
        }
        .browse {
          width: 100%;
          display: flex;
          justify-content: center;
          margin-bottom: 20px;
          .tag {
            cursor: pointer;
            margin-right: 5px;
            .icon {
              margin-right: 5px;
            }
          }
        }
        .describe {
          text-align: center;
          color: rgba(0, 0, 0, 0.85);
          font-size: 14px;
          margin-bottom: 20px;
        }
      }
      .material-other {
        width: 100%;
        text-align: left;
        font-size: 14px;
        color: #000;
        .material-link {
          margin-top: 20px;
          .recommender {
            display: flex;
            align-items: center;
            width: 100%;
            .user-info {
              display: flex;
              align-items: center;
              cursor: pointer;
              .user-avatar {
                width: 32px;
                height: 32px;
                border-radius: 50%;
                overflow: hidden;
                margin-right: 5px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
