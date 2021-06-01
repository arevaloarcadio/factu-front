
<template>
  <div>
    <CCard>
      <CCardHeader>
        <h5>
          {{ entity }}
          <router-link :to="{ name: 'reminders.create' }">
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
          <paginate name="items" :list="items" :per="10" tag="tbody">
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
              <td>{{item.description}}</td> 
              <td>{{new Date(item.date_when).toLocaleDateString()}}</td> 
              <td v-html="has_customer(item.customer)"></td>  
              <td v-if ="item.status == 'Pendiente'">
                <span class="badge badge-danger">{{item.status}}</span>
              </td> 
              <td v-else>
                <span class="badge badge-success">{{item.status}}</span>
              </td> 
              <td>
                <router-link :to="{ name: 'reminders.edit', params: { id: item.id } }">
                  <CButton class="m-2 btn--link" size="sm" color="warning">Editar</CButton>
                </router-link>
              </td>
            </tr>
          </paginate>
        </table>
        <paginate-links for="items" :limit="10" :show-step-links="true" :classes="{'ul': 'pagination', 'li': 'page-item', 'a': 'page-link'}"></paginate-links>
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
  name: "ReminderPage",
  components: {},
  data() {
    return {
      entity: "Recordatorio",
      newEntity: "Nuevo Recordatorio",
      entityTable: "reminders",
      items: [],
      paginate : ['items'],
      fields: [
        { key: "description", label: "Descripción",          _classes: "text-center" },
        { key: "date_when", label: "Fecha de aviso",          _classes: "text-center" },
        { key: "customer", label: "Cliente",          _classes: "text-center" },
        { key: "status", label: "Status",          _classes: "text-center" },
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
    this.getReminders();
  },
  mounted() {},
  methods: {
    has_customer  : function (customer) {
        if(customer == null){
          return '<span class="badge badge-primary">No tiene cliente actualmente</span>';
        }else{
          return  '<a href="#/customers/'+customer.id+'/edit">'+customer.firstname +' '+customer.lastname+'</a>'
        }
    },
    getReminders() {
      
      axios
        .get('reminders')
        .then(resp => {
          this.items = resp.data;
        })
        .catch(err => console.log(err));
    },
    updated() {
      console.log(this.entityForm, "<----");
    },

    page(url) {
      axios({ url: url, method: "GET" })
        .then((resp) => {
          const t = this;
          t.items = resp.data.users;
          if (resp.data.users.next_page_url) {
            t.nextUrl = resp.data.users.next_page_url;
          } else {
            t.nextUrl = "";
          }
          if (resp.data.users.prev_page_url) {
            t.previousUrl = resp.data.users.prev_page_url;
          } else {
            t.previousUrl = "";
          }
          resolve(resp);
        })
        .catch((err) => {
          reject(err);
        });
    },
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