/*
 * @Descripttion: 文章列表模块
 * @Author: 银河以北
 * @Date: 2021-08-10 00:01:55
 * @LastEditors: 银河以北
 * @LastEditTime: 2021-10-30 11:15:27
 */
import { request } from '@/utils/request'

/**
 * @Description: 获取某个文章类型的数据
 * @Author: 银河以北
 * @Date: 2021-08-10 00:02:25
 * @param {*}
 * @return {*}
 */
export function getArticleTypeList(data) {
    return request({
        url: '/blog/article/verify/getArticleTypeList',
        method: 'GET',
        params: data
    })
}

/**
 * @Description: 前台用户阅读文章内容
 * @Author: 银河以北
 * @Date: 2021-08-11 16:40:30
 * @param {*} data
 * @return {*}
 */
export function readArticleContent(data) {
    return request({
        url: '/blog/article/release/readArticleContent',
        method: 'GET',
        params: data
    })
}


/**
 * @Description: 前台用户申诉自己的文章
 * @Author: 银河以北
 * @Date: 2021-08-15 14:36:47
 * @param {*} data
 * @return {*}
 */
export function appealArticle(data) {
    return request({
        url: '/blog/article/verify/appealArticle',
        method: 'POST',
        data
    })
}

/**
 * @Description: 获取用户收藏的文章
 * @Author: 银河以北
 * @Date: 2021-08-28 22:21:55
 * @param {*}
 * @return {*}
 */
export function getUserArticleCollection(data) {
    return request({
        url: '/blog/article/verify/getUserArticleCollection',
        method: 'GET',
        params: data
    })
}

/**
 * @Description: 删除文章数据
 * @Author: 银河以北
 * @Date: 2021-08-03 00:59:12
 * @param {*} data
 * @return {*}
 */
export function deleteArticle(data) {
    return request({
        url: '/blog/article/verify/deleteArticle',
        method: 'DELETE',
        params: data
    })
}