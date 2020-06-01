import Vue from 'vue'
import VueRouter from 'vue-router'
import Demo from "../components/Demo";
import File from "../components/File";
import HelloWorld from "../components/HelloWorld";
import Login from "../components/Login";
import Index from "../components/index"


Vue.use(VueRouter)

  const routes = [
  {
    path: '/demo',
    name: 'demo',
    component: Demo
  },
  {
    path: '/file',
    name: 'file',
    component: File
  },
    {
      path: '/helloWorld',
      name: 'helloWorld',
      component: HelloWorld
    },
    {
      path: '/index',
      name: 'index',
      component: Index
    },
    {
      path: '/',
      name: 'login',
      component: Login
    },


  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
]
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
};

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router
