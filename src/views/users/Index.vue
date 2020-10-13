<template>
  <div>
    <CCard>
      <CCardHeader>
        <h5>{{ entity }}<router-link :to="{ path: 'users/create' }"> <CButton  class="float-right py-0 mr-1" color="success">
          <CIcon name="cil-pencil" class="mr-2 cil-energy"></CIcon>{{ newEntity }}
            </CButton>  </router-link></h5>
      </CCardHeader>
      <CCardBody class="py-2"  v-if="items">
        <CDataTable class="mb-0 table-outline" hover :items="items" :fields="tableFields" head-color="light" no-sorting v-if="items" >
          <td slot="name" slot-scope="{item}">
            {{ item.name }}
          </td>
          <td slot="admin" slot-scope="{item}" class="text-center">
            <CIcon name="cil-check" style="color:green;" height="25" v-show="item.admin"/>
          </td>
          <td slot="actions" slot-scope="{item}">
            <router-link :to="'/users/'+item.id" :disabled="true">Editar</router-link>
          </td>
        </CDataTable>
      </CCardBody>
      <CCardFooter  v-if="items">
        <nav>
          <ul class="pagination justify-content-center">
            <li class="page-item">
              <a class="page-link" @click="page(previousUrl)" v-show="previousUrl" tabindex="-1">Anterior</a>
            </li>
            <li class="page-item">
              <a class="page-link" @click="page(nextUrl)" v-show="nextUrl">Siguiente</a>
            </li>
          </ul>
        </nav>
      </CCardFooter>
    </CCard>
  </div>
</template>

<script>
import axios from 'axios'
import VueNotifications from "vue-notifications"
import formGenerator from "@/views/components/formGenerator.vue"

export default {
  name: 'Users',
  components:{ formGenerator},
  data () {
    return {
      entity: "Usuarios",
      newEntity: "Nuevo Usuario",
      entityTable: "users",
      items: [],
      submitted: false,
      itemModal: false,
      tableFields: [
        { key: 'firstname', label: 'Nombre' },
        { key: 'lastname', label: 'Apellidos' },
        { key: 'email', label: 'Email', _classes: 'text-center' },
        { key: 'admin', label: 'Administrador', _classes: 'text-center' },
      ],
      previousUrl: "",
      nextUrl: "",
    }
  },
  created(){
    this.getItems();
  },
  mounted(){
    
  },
  methods:{
    getItems(){
      axios({url: this.entityTable,  method: 'GET' })
        .then(resp => {
          const t = this
          t.items = resp.data
          //resolve(resp)
          resolve(resp)
        })
        .catch(err => {
          //commit('auth_error', err)
          //reject(err)
        });
    },
    page(url){
      axios({url: url,  method: 'GET' })
        .then(resp => {
          const t = this
          t.items = resp.data
          if(resp.data.next_page_url){
            t.nextUrl = resp.data.next_page_url
          }else{
            t.nextUrl = ""
          }
          if(resp.data.prev_page_url){
            t.previousUrl = resp.data.prev_page_url
          }else{
            t.previousUrl = ""
          }
          resolve(resp)
        })
        .catch(err => {
          reject(err)
        });
    },
    updated(){
      console.log(this.entityForm,"<----")
    }
  },
  notifications: {
    showSuccessMsg: {
      type: VueNotifications.types.success,
      title: 'Operación completada',
      message: 'Usuario añadido con éxito!'
    },
    showErrorMsg: {
      type: VueNotifications.types.error,
      title: 'Operación rechazada',
      message: 'Algo salió mal'
    }
  }
}
</script>