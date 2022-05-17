import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/prueba',
    name: 'prueba',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Prueba.vue')
  },
  {
    path: '/pruebachart',
    name: 'pruebachart',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Charts/PruebaView.vue')
  },
  {
    path: '/dashresp',
    name: 'dashresp',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Process/DashResp.vue')
  },
  ////////////////////////////////////
  ////////////// VISTAS //////////////
  ////////////////////////////////////
  {
    path: '/login',
    name: 'login',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Login/LoginView.vue')
  },
  // primera vista de un lider o jefe de proyecto
  {
    path: '/leader',
    beforeEnter: (to, from, next) => {
      if(JSON.parse(localStorage.getItem("leaderId"))){
        next();
      }else{
        next(from.path)
      }
    },
    name: 'laeder',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Leader/LeaderView.vue')
  },
  {
    path: '/team',
    beforeEnter: (to, from, next) => {
      if(JSON.parse(localStorage.getItem("teamId")) && JSON.parse(localStorage.getItem("teamName"))){
        next();
      }
      else{
        next(from.path)
      }
    },
    name: 'team',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Team/TeamView.vue')
  },
  {
    path: '/dashboard',
    beforeEnter: (to, from, next) => {
      if(JSON.parse(localStorage.getItem("teamId")) && JSON.parse(localStorage.getItem("teamName"))){
        next();
      }
      else{
        next(from.path)
      }
    },
    name: 'dashboard',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Process/DashboardView.vue')
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  const loggedIn = JSON.parse(localStorage.getItem('authenticated'));
  const root = ['/'].includes(to.path);
  const login = ['/login'].includes(to.path);
  if ((root || !loggedIn) && !login) {
    next('/login');
  } else {
    next();
  }
})

export default router
