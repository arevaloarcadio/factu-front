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


//USERS
const Users = () => import('@/views/users/Index')
const createUser = () => import('@/views/users/Create')

//CUSTOMERS
const Customers = () => import('@/views/customers/Index')
const createCustomer = () => import('@/views/customers/Create')

//CUSTOMERS
const Products = () => import('@/views/products/Index')
const createProduct = () => import('@/views/products/Create')
//const editUser = () => import('@/views/users/edit')

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
      redirect: '/dashboard',
      name: 'Inicio',
      component: TheContainer,
      children: [
        {
          path: 'dashboard',
          name: 'Escritorio',
          component: Dashboard
        },
        {
          path: 'users',
          redirect: 'users/list',
          meta: {
            label: 'Usuarios'
          },
          component: {
            render(c) {
              return c('router-view')
            }
          },
          children: [
            {
              path: 'list',
              name: 'Usuarios',
              component: Users
            },
            {
              path: 'create',
              meta: {
                label: 'Crear Usuario'
              },
              name: 'Crear',
              component: createUser
            }
          ]
        },
        {
          path: 'customers',
          redirect: 'customers/list',
          meta: {
            label: 'Clientes'
          },
          component: {
            render(c) {
              return c('router-view')
            }
          },
          children: [
            {
              path: 'list',
              name: 'Clientes',
              component: Customers
            },
            {
              path: 'create',
              meta: {
                label: 'Crear Cliente'
              },
              name: 'Crear Cliente',
              component: createCustomer
            }
          ]
        },
        {
          path: 'products',
          redirect: 'products/list',
          meta: {
            label: 'Productos'
          },
          component: {
            render(c) {
              return c('router-view')
            }
          },
          children: [
            {
              path: 'list',
              name: 'Productos',
              component: Products
            },
            {
              path: 'create',
              meta: {
                label: 'Crear Producto'
              },
              name: 'Crear Producto',
              component: createProduct
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

