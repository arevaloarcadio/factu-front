<template>
  <div id="app">
    <OrgChart :unit="organization" v-if="organization.length > 0 && users.length > 0 && getUser.unit" :users="users" :unit_id="getUser.unit" />
  </div>
</template>

<script>

import OrgChart from './components/OrgChart.vue'
import axios from 'axios'
import { mapGetters,mapActions } from 'vuex'

export default {
name: 'app',
components: {
  OrgChart,
},
mounted(){
  this.getItems()
  this.getParents()
},
data () {
  return {
    entity: "Organigrama",
    organization: [],
    users: [],
    unit_ids :[],
    subordinates : []
  }
},
methods:{
  ...mapActions([
    'setParent'
  ]),
  getItems(){
    axios({url: this.entityTable,  method: 'GET' })
      .then(resp => {
        const t = this
        t.organization = resp.data
        this.unit_ids.push(this.getUser.unit)
        this.getUsers()
        resolve(resp)
      })
      .catch(err => {
        //commit('auth_error', err)
        //reject(err)
      });
  },
   getParents(){
    axios({url: 'organizations/parent/'+this.getUser.id+'/'+this.getUser.unit,  method: 'GET' })
      .then(resp => {
        console.log(resp)
         this.setParent(resp.data.parent_id)
      })
      .catch(err => {
        //commit('auth_error', err)
        //reject(err)
      });
  },
  getUsers(){
    axios.get("users")
      .then(resp => {
        const t = this
        t.users = resp.data
        resolve(resp)
      })
      .catch(err => {
        //commit('auth_error', err)
        //reject(err)
      });
  },
},
  computed: {
    ...mapGetters([
      'getUser','getParent'
    ]),
    entityTable(){
      return 'organizations/'+this.getUser.unit
    }
  },
  watch: {
    entityTable(){
      this.$router.go(0)
      this.getItems()
    }
  }
}
</script>

<style>
#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}

html, body {
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
    overflow: hidden;
    font-family: Helvetica;
}

#tree {
    width: 100%;
    height: 100%;
}
</style>