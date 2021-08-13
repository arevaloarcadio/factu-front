
<template>
  <div>
    <CCard>
      <CCardHeader>
        <h5>
          {{ entity }}
          <router-link :to="{ name: 'customers.create.relationships',params:{customerId:customerId} }">
            <CButton class="float-right py-0 mr-1" color="success">
              <CIcon name="cil-pencil" class="mr-2 cil-energy"></CIcon>
              {{ newEntity }}
            </CButton>
          </router-link>
        </h5>
      </CCardHeader>
      <CCardBody class="py-2" v-if="items">

          <table class="table table-responsive-sm table-striped">
           <thead >
            <tr>
              <th v-for="field in fields" :class="{true : field._classes }">{{field.label}}</th>
            </tr>
          </thead>
          <paginate name="items" :list="items" :per="5" tag="tbody">
            <tr v-if="items.length == 0">
              <td :colspan="fields.length">
                <center>
                  <h4 style="margin: 0;">
                    Sin  registros
                  </h4>
                </center>
              </td>
            </tr>
               <tr v-for="item in paginated('items')">
              <td>    
                  <a :href="'#/customers/'+item.id+'/edit'">{{item.firstname +' '+item.lastname}}</a>
                 
    
              </td>
              <td>{{item.email}}</td> 
              <td>{{item.pivot.description}}</td> 
              <td slot="actions">
                <router-link :to="{ name: 'customers.edit.relationships', params:{customerId:customerId,relationshipId:item.pivot.relationship_customer_id}, query: getQuery(item) }">
                  <CButton class="m-2 btn--link" size="sm" color="warning">Editar</CButton>
                </router-link>
              </td>    
            </tr>
          </paginate>
        </table>
        <paginate-links for="items" :limit="5" :show-step-links="true" :classes="{'ul': 'pagination', 'li': 'page-item', 'a': 'page-link'}"></paginate-links>
      </CCardBody>
    </CCard>
  </div>
</template>

<script>

import axios from "axios";
import VueNotifications from "vue-notifications";
import Swal from 'sweetalert2/dist/sweetalert2.js'

export default {
  props:['customer_id'],
  name: "RelationshipsTable",
  components: {},
  data() {
    return {
      customerId : null,
      entity: "Relación",
      current_endpoint: 'v1/tasks',
      newEntity: "Nueva Relación",
      entityTable: "relationships",
      items: [],
      paginate : ['items'],
      fields: [
        { key: "firstname_lastname", label: "Nombre y Apellido" },
        { key: "email",     label: "Correo electrónico", _classes: "text-center" },
        { key: "relationships",  label: "Relación", _classes: "text-center" },
        {
          key: 'actions',
          label: 'Acciones',
          _style: { width: '1%' },
          sorter: false,
          filter: false
        }
      ],
      previousUrl: "",
      nextUrl: "",
    };
  },
  created() {
    this.customerId = this.customer_id;
    this.getRelationships();
  },
 watch: {
    /*'$route.params.id': function (id) {
      Swal.showLoading()
      this.$emit("update")
      this.customerId = id;
      this.getRelationships();
    }*/
  },
  methods: {
    getRelationships() {
      
      axios
        .get('v1/customers/'+this.customerId+'/relationships')
        .then(resp => {
          this.items = resp.data;
          Swal.close()
        })
        .catch(err => console.log(err));

    },
    getParams(item) {
      return { relationship_customer_id: item.pivot.relationship_customer_id, description: item.pivot.description };
    },
    getQuery(item) {
      return { relationship_customer_id: item.pivot.relationship_customer_id, description: item.pivot.description };
    }
  },
  notifications: {
    showSuccessMsg: {
      type: VueNotifications.types.success,
      title: "Operación completada",
      message: "Usuario añadido con éxito!",
    },
    showErrorMsg: {
      type: VueNotifications.types.error,
      title: "Operación rechazada",
      message: "Algo salió mal",
    },
  },
};
</script>

<style lang="scss" scoped>
.btn--link { color: #FFF }
</style>

<style type="text/css">
  a{
    color: blue;
  }
</style>