/*
 * @Descripttion: 
 * @Author: 银河以北
 * @Date: 2021-06-10 12:07:39
 * @LastEditors: 银河以北
 * @LastEditTime: 2021-06-12 16:23:33
 */
import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
/* Layout */
import Layout from '@/layout'


Vue.use(VueRouter)

const routes = [{
        path: '/',
        component: Layout,
        meta: { title: 'layout' },
        children: [{
                path: '/',
                name: 'Home',
                meta: { title: 'Home' },
                component: Home,
            }, {
                path: '/about',
                name: 'About',
                meta: { title: 'About' },
                component: function() {
                    return import ('../views/About.vue')
                }
            },
            {
                path: '/test',
                name: 'Test',
                meta: { title: 'Test' },
                component: function() {
                    return import ('../views/Test.vue')
                }
            }
        ]
    },

]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router