<template>
  <CDropdown
    inNav
    class="c-header-nav-items"
    placement="bottom-end"
    add-menu-classes="pt-0"
  >
    <template #toggler>
      <CHeaderNavLink>
        <div class="c-avatar">
          <img
            :src="'img/profiles/'+user.image"
            class="c-avatar-img "
          />
        </div>
      </CHeaderNavLink>
    </template>
    <CDropdownHeader tag="div" class="text-center" color="light">
      <strong>Mi Cuenta</strong>
    </CDropdownHeader>
    <CDropdownItem>
      <CIcon name="cil-envelope-open" /> Mensajes
      <CBadge color="success" class="ml-auto">{{ itemsCount }}</CBadge>
    </CDropdownItem>
    <CDropdownItem>
      <CIcon name="cil-task" /> Tareas
      <CBadge color="danger" class="ml-auto">{{ itemsCount }}</CBadge>
    </CDropdownItem>
    <CDropdownHeader
      tag="div"
      class="text-center"
      color="light"
    >
      <strong>Configuración</strong>
    </CDropdownHeader>
    <CDropdownItem>
      <CIcon name="cil-user" /> Perfil
    </CDropdownItem>
    <CDropdownDivider/>
    <CDropdownItem>
      <CIcon name="cil-lock-locked" /> Cerrar Sesión
    </CDropdownItem>
  </CDropdown>
</template>

<script>

import user from '../plugins/jwt/user'  
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'TheHeaderDropdownAccnt',
  data () {
    return { 
      itemsCount: 42,
      user : JSON.parse(user.getUser())
    }
  },
  computed: {
    ...mapGetters([
                'getUser'
            ]),
  }
}
</script>

<style scoped>
  .c-icon {
    margin-right: 0.3rem;
  }
</style>