
<template>
  <div>
    <CCard>
      <CCardHeader>
        <h5>
          {{ entity }}
          <router-link :to="{ name: 'tasks.create.customer',params:{customerId:customer_id} }">
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
          <paginate name="items" :list="items" :per="3" tag="tbody">
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
              <td>{{item.subject}}</td> 
              <td>{{item.description }}</td>
              <td>{{item.date}}</td> 
              <td>
                <router-link :to="{ name: 'tasks.edit', params: { id: item.id } }">
                  <CButton class="m-2 btn--link" size="sm" color="warning">Editar</CButton>
                </router-link>
              </td>
            </tr>
          </paginate>
        </table>
        <paginate-links for="items" :limit="3" :show-step-links="true" :classes="{'ul': 'pagination', 'li': 'page-item', 'a': 'page-link'}"></paginate-links>
        <!--<CDataTable
          class="mb-0 table-outline"
          hover
          :items="items"
          :fields="fields"
          head-color="light"
          no-sorting
          v-if="items">
          <td slot="actions" slot-scope="{ item }">
            <router-link :to="{ name: 'tasks.edit', params: { id: item.id } }">
              <CButton class="m-2 btn--link" size="sm" color="warning">Editar</CButton>
            </router-link>
          </td>
        </CDataTable>-->
      </CCardBody>

      <!--<CCardFooter v-if="items">
        <nav>
          <ul class="pagination justify-content-center">
            <li class="page-item">
              <a
                class="page-link"
                @click="page(previousUrl)"
                v-show="previousUrl"
                tabindex="-1">
                Anterior
              </a>
            </li>
            <li class="page-item">
              <a class="page-link" @click="page(nextUrl)" v-show="nextUrl">
                Siguiente
              </a>
            </li>
          </ul>
        </nav>
      </CCardFooter>-->
    </CCard>
  </div>
</template>

<script>

import axios from "axios";
import VueNotifications from "vue-notifications";

export default {
  props:['items','customer_id'],
  name: "TaskTable",
  components: {},
  data() {
    return {
      entity: "Tareas",
      current_endpoint: 'v1/tasks',
      newEntity: "Nueva Tarea",
      entityTable: "tasks",
      paginate : ['items'],
      fields: [
        { key: "subject", label: "Tema",          _classes: "text-center" },
        { key: "description", label: "Descripción",          _classes: "text-center" },
        { key: "date",    label: "Fecha", _classes: "text-center" },
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
  'customer_id': function (id) {
      Swal.showLoading()
      this.$emit("update")
      this.customer_id = id;
      this.reset_page(this.paginate);
    },
  methods: {
    has_customer  : function (customer) {
        if(customer == null){
          return '<span class="badge badge-warning">No tiene cliente actualmente</span>';
        }else{
          return customer.firstname+' '+customer.lastname;
        }
    },
     reset_page : function (paginate){
      for(let pag in paginate){
        paginate[pag].page = 0;
      }
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