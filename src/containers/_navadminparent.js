export default [
  {
    _name: 'CSidebarNav',
    _children: [
      {
        _name: 'CSidebarNavItem',
        name: 'Timeline',
        to: '/timeline',
        icon: 'cil-speedometer',
        badge: {
          color: 'success',
          text: 'NEW'
        },
      },
      {
        _name: 'CSidebarNavItem',
        name: 'Organigrama',
        to: '/dashboard',
        icon: 'cil-speedometer',
        badge: {
          color: 'primary',
          text: 'NEW'
        }
      },
      {
        _name: 'CSidebarNavItem',
        name: 'Usuarios',
        to: '/users',
        icon: 'cil-people'
      },
      {
        _name: 'CSidebarNavItem',
        name: 'Clientes',
        to: '/customers',
        icon: 'cil-people'
      },
      {
        _name: 'CSidebarNavItem',
        name: 'Tipo de Productos',
        to: '/product_types',
        icon: 'cil-puzzle'
      },
      {
        _name: 'CSidebarNavItem',
        name: 'Tareas',
        to: '/tasks',
        icon: 'cil-puzzle'
      },
      {
        _name: 'CSidebarNavItem',
        name: 'Recordatorio',
        to: '/reminders',
        icon: 'cil-puzzle'
      },
      {
        _name: 'CSidebarNavItem',
        name: 'Revisión',
        to: '/revisions',
        icon: 'cil-puzzle'
      },
      {
        _name: 'CSidebarNavDivider',
        _class: 'm-2'
      },
    ]
  }
]