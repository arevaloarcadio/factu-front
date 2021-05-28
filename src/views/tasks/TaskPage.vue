
<template>
  <div>
    <CCard>
      <CCardHeader>
        <h5>
          {{ entity }}
          <router-link :to="{ name: 'tasks.create' }">
            <CButton class="float-right py-0 mr-1" color="success">
              <CIcon name="cil-pencil" class="mr-2 cil-energy"></CIcon>
              {{ newEntity }}
            </CButton>
          </router-link>
        </h5>
      </CCardHeader>

      <CCardBody class="py-2" v-if="items">
        <div class="controls">
          <div class="row">
            <div class="col-md-1">
               <label for="filter"  class="typo__label mb-0 text-dark" style="margin-top: 10px;">Filtrar</label>
            </div>
              <div class="col-md-2">
                <select id="filter" v-model="filter" @change="getTasks()" class="form-control">
                      <option value="Mis Tareas" >Mis Tareas</option>
                      <option value="Suborbinados">Tareas de mis Suborbinado</option>
                </select>
              </div>
            </div>
         </div> 
         <br> 
          <table class="table table-responsive-sm table-striped">
           <thead >
            <tr>
              <th v-if="filter == 'Suborbinados'">Nombre del Suborbinado</th>
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
              <td  v-if="filter == 'Suborbinados'" v-html="getResponsable(item.users)">{{item.subject}}</td> 
              <td>{{item.subject}}</td> 
              <td>{{item.description }}</td>
              <td v-html="has_customer(item.customer)"></td>  
              <td>{{item.date}}</td> 
              <td>
                <router-link :to="{ name: 'tasks.edit', params: { id: item.id } }">
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
import { mapGetters } from 'vuex'


export default {
  name: "TaskPage",
  components: {},
  data() {
    return {
      entity: "Tareas",
      current_endpoint: 'v1/tasks',
      newEntity: "Nueva Tarea",
      entityTable: "tasks",
      items: [],
      paginate : ['items'],
      subordinates: [],
      filter : '',
      fields: [
        { key: "subject", label: "Tema",          _classes: "text-center" },
        { key: "description", label: "Descripción",          _classes: "text-center" },
        { key: "customer", label: "Cliente",          _classes: "text-center" },
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
  created() {
    this.filter = 'Mis Tareas'; 
    this.getTasks();
    this.getSubordinates();
    
  },
  computed: {
    ...mapGetters([
        'getUser'
    ]),
  },
  methods: {
    has_customer  : function (customer) {
        if(customer == null){
          return '<span class="badge badge-primary">No tiene cliente actualmente</span>';
        }else{
          return  '<a href="#/customers/'+customer.id+'/edit">'+customer.firstname +' '+customer.lastname+'</a>'
        }
    },
    getTasks() {
      this.items = [];

      if(this.filter == 'Suborbinados'){
        
        if (this.subordinates.length == 0) {
          return;
        }

        const user_ids = this.subordinates.map(subordinate => {
          console.log(subordinate)
          return { id: subordinate.id };
        });

        axios
          .post(this.current_endpoint+'/subordinate',{user_ids : user_ids})
          .then(resp => {
            this.items = resp.data;
            this.reset_page(this.paginate)
          })
          .catch(err => console.log(err));

      }else{

         axios
          .get(this.current_endpoint)
          .then(resp => {
            this.items = resp.data;
            this.reset_page(this.paginate)
          })
          .catch(err => console.log(err));
      }
    },
    getResponsable (users){
      for (var i = 0; i < users.length; i++) {
        if(users[i].pivot.is_responsable){
          return users[i].firstname +' '+users[i].lastname;
        }
      }
      return users[0].firstname +' '+users[i].lastname;
    },
    getSubordinates(){
      axios({url: 'organizations/subordinates/'+this.getUser.id+'/'+this.getUser.unit,  method: 'GET'})
        .then(resp => {
          this.subordinates = resp.data
          resolve(resp)
        })
        .catch(err => {
          //commit('auth_error', err)
          //reject(err)
        });
    },
     reset_page : function (paginate){
      for(let pag in paginate){
        paginate[pag].page = 0;
      }
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