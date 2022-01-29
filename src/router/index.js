import Vue from 'vue'
import Router from 'vue-router'

// Containers
const TheContainer = () => import('@/containers/TheContainer')

// Views
const Dashboard = () => import('@/views/Dashboard')

// Views - Pages
const Page404 = () => import('@/views/pages/Page404')
const Page500 = () => import('@/views/pages/Page500')
const Login = () => import('@/views/pages/Login')
const Register = () => import('@/views/pages/Register')

const UserPage = () => import('@/views/users/UserPage')
const UserCreate = () => import('@/views/users/UserCreate')
const UserEdit = () => import('@/views/users/UserEdit')

Vue.use(Router)

export default new Router({
  mode: 'hash', // https://router.vuejs.org/api/#mode
  linkActiveClass: 'active',
  scrollBehavior: () => ({ y: 0 }),
  routes: configRoutes()
})

function configRoutes () {
  return [
    {
      path: '/',
      redirect: '/pages/login',
      name: 'Inicio',
      component: TheContainer,
      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
          component: Dashboard
        },
        {
          path: 'users',
          meta: { label: 'Usuarios' },
          component: { render(c) { return c('router-view') } },
          children: [
            {
              path: '',
              name: 'users.index',
              meta: { label: 'Usuarios' },
              component: UserPage
            },
            {
              path: 'create',
              name: 'users.create',
              meta: { label: 'Crear Usuario' },
              component: UserCreate
            },
            {
              path: ':id/edit',
              meta: { label: 'Editar Usuario' },
              name: 'users.edit',
              component: UserEdit
            }
          ]
        },
      ]
    },
    {
      path: '/pages',
      redirect: '/pages/404',
      name: 'Pages',
      component: {
        render (c) { return c('router-view') }
      },
      children: [
        {
          path: '404',
          name: 'Page404',
          component: Page404
        },
        {
          path: '500',
          name: 'Page500',
          component: Page500
        },
        {
          path: 'login',
          name: 'Login',
          component: Login
        },
        {
          path: 'register',
          name: 'Register',
          component: Register
        }
      ]
    }
  ]
}

