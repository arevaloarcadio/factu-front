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
const UserPage = () => import('@/views/users/UserPage')
const UserCreate = () => import('@/views/users/UserCreate')
const UserEdit = () => import('@/views/users/UserEdit')

//CUSTOMERS
const CustomerPage = () => import('@/views/customers/CustomerPage')
const CustomerCreate = () => import('@/views/customers/CustomerCreate')
const CustomerEdit = () => import('@/views/customers/CustomerEdit')

const ProductsPage = () => import('@/views/products/ProductPage')
const ProductCreate = () => import('@/views/products/ProductCreate')
const ProductEdit = () => import('@/views/products/ProductEdit')

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
          meta: { label: 'Usuarios List' },
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
            },
          ]
        },
        {
          path: 'customers',
          redirect: 'customers',
          component: { render(c) { return c('router-view') } },
          children: [
            {
              path: '',
              name: 'customers.index',
              meta: { label: 'Clientes' },
              component: CustomerPage
            },
            {
              path: 'create',
              meta: { label: 'Crear Cliente' },
              name: 'customers.create',
              component: CustomerCreate
            },
            {
              path: ':id/edit',
              meta: { label: 'Editar Cliente' },
              name: 'customers.edit',
              component: CustomerEdit
            },
            {
              path: ':id/products/create',
              meta: { label: 'Crear Producto' },
              name: 'products.create',
              component: ProductCreate
            },
            {
              path: ':customerId/products/:productId/edit',
              meta: { label: 'Editar Producto' },
              name: 'products.edit',
              component: ProductEdit
            }
          ]
        },
        {
          path: 'products',
          redirect: 'products',
          component: { render(c) { return c('router-view') } },
          children: [
            {
              path: '',
              name: 'products.index',
              meta: { label: 'Productos' },
              component: ProductsPage
            },
            // {
            //   path: 'create',
            //   name: 'products.create',
            //   meta: { label: 'Crear Producto' },
            //   component: ProductCreate
            // }
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

