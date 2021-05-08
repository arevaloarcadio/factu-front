<template>
  <CHeader fixed with-subheader light>
    <CToggler
      in-header
      class="ml-3 d-lg-none"
      @click="$store.commit('toggleSidebarMobile')"
    />
    <CToggler
      in-header
      class="ml-3 d-md-down-none"
      @click="$store.commit('toggleSidebarDesktop')"
    />
    <CHeaderBrand class="mx-auto d-lg-none" to="/">
      <!-- SELECT UNIT !-->
    </CHeaderBrand>
    <CHeaderNav class="d-md-down-none mr-auto">
      <CHeaderNavItem class="px-3">
        <CHeaderNavLink to="/dashboard">
          Escritorio
        </CHeaderNavLink>
      </CHeaderNavItem>
      <CHeaderNavItem class="px-3">
        <CHeaderNavLink to="/users" exact>
          Usuarios
        </CHeaderNavLink>
      </CHeaderNavItem>
      <CHeaderNavItem>
        <select v-if="units.length" class="select form-control" @change="sendUnit($event.target.value)">
          <option v-for="u in units" :value="u.unit_id" :selected="getUser.unit == u.unit_id">{{ u.unit.name }}</option>
        </select>
      </CHeaderNavItem>

    </CHeaderNav>
    <CHeaderNav class="mr-4">
      <CHeaderNavItem class="d-md-down-none mx-2">
        <CHeaderNavLink>
          <CIcon name="cil-bell"/>
        </CHeaderNavLink>
      </CHeaderNavItem>
      <CHeaderNavItem class="d-md-down-none mx-2">
        <CHeaderNavLink>
          <CIcon name="cil-list"/>
        </CHeaderNavLink>
      </CHeaderNavItem>
      <CHeaderNavItem class="d-md-down-none mx-2">
        <CHeaderNavLink>
          <CIcon name="cil-envelope-open"/>
        </CHeaderNavLink>
      </CHeaderNavItem>
      <TheHeaderDropdownAccnt/>
    </CHeaderNav>
    <CSubheader class="px-3">
      <CBreadcrumbRouter class="border-0 mb-0"/>
    </CSubheader>
  </CHeader>
</template>

<script>
import TheHeaderDropdownAccnt from './TheHeaderDropdownAccnt'
//import axios from 'axios'
import { mapGetters, mapActions } from 'vuex'


export default {
  name: 'TheHeader',
  components: {
    TheHeaderDropdownAccnt
  },
  data () {
    return {
      units: [],
    }
  },
  created(){
    this.getItems();
    // console.log(this.getUser)
  },
  mounted(){
    //console.log(this.getUser)
  },
  methods:{
    ...mapActions([
                'setUnit'
            ]),
    getItems(){
      this.$http({url: 'organizations/mine',  method: 'GET' })
        .then(resp => {
          const t = this
          t.units = resp.data
          resolve(resp)
        })
        .catch(err => {
          //commit('auth_error', err)
          //reject(err)
        });
    },
    sendUnit(valor){
      this.setUnit(valor)
      this.$router.go(0)
    }
  },
  computed: {
    ...mapGetters([
                'getUser'
            ]),
  }
}
</script>
