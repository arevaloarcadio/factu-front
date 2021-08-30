<template>
  <CSidebar 
    fixed 
    :minimize="minimize"
    :show="show"
    @update:show="(value) => $store.commit('set', ['sidebarShow', value])"
  >
    <CSidebarBrand class="d-md-down-none" to="/">
      <CIcon 
        class="c-sidebar-brand-full" 
        name="logo" 
        size="custom-size" 
        :height="35" 
        viewBox="0 0 556 134"
      />
      <CIcon 
        class="c-sidebar-brand-minimized" 
        name="logo" 
        size="custom-size" 
        :height="35" 
        viewBox="0 0 110 134"
      />
    </CSidebarBrand>

    <CRenderFunction flat :content-to-render="nav"/>
    <CSidebarMinimizer
      class="d-md-down-none"
      @click.native="$store.commit('set', ['sidebarMinimize', !minimize])"
    />
  </CSidebar>
</template>

<script>
import _nav from './_nav'
import _navadmin from './_navadmin'
import _navadminparent from './_navadminparent'
import _navparent from './_navparent'
import { mapGetters } from 'vuex'

export default {
  name: 'TheSidebar',
  data(){
    return{
      nav : null
    }
  },
  created(){
    if(this.getUser.admin ){
      if(this.getUser.id == this.getParent){
        this.nav = _navadminparent
      }else{
        this.nav = _navadmin
      } 
    }else{

       if(this.getUser.id == this.getParent){
        this.nav = _navparent
      }else{
        this.nav = _nav
      } 
    }
  },

  computed: {
    ...mapGetters([
                  'getUser','getParent'
              ]),
    show () {
      return this.$store.state.menu.sidebarShow 
    },
    minimize () {
      return this.$store.state.menu.sidebarMinimize 
    }
  }
}
</script>
