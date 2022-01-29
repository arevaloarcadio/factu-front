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
            :src="baseURL+'/img/default.png'"
            class="c-avatar-img "
          />
        </div>
      </CHeaderNavLink>
    </template>
    <CDropdownHeader tag="div" class="text-center" color="light">
      <strong>{{user.name}}</strong>
    </CDropdownHeader>
   
    <CDropdownItem>
      <CIcon name="cil-user" /> Perfil
    </CDropdownItem>
    <CDropdownDivider/>
    <CDropdownItem>
      <CIcon name="cil-lock-locked"  />
        <a class="nav-link"  @click="logout">Cerrar Sesión</a>
    </CDropdownItem>
  </CDropdown>
</template>

<script>

import axios from 'axios';
import {mapGetters,mapState} from 'vuex';
import jwtToken from '../plugins/jwt/jwt-token';
import user from '../plugins/jwt/user' ; 
import router from '@/router'

export default {
  name: 'TheHeaderDropdownAccnt',
  
  data () {
    return { 
      itemsCount: 42,
      baseURL : null,
      task_items : 0,
      user : JSON.parse(user.getUser())
    }
  },
  created() {
    this.baseURL = axios.defaults.baseURL;
  },
  methods: {
    logout() {
      jwtToken.removeToken();
      this.$store.dispatch('unsetAuthUser')
      .then(() => {
        router.push({path: '/pages/login'});
      });
    },
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