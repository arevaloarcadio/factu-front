
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
            <div class="col-md-2">
                  <input class="form-control"  size="50" placeholder="Buscar Tareas" v-model="filter_text" type="text"><span class="input-group-append"></span>
              </div>
            <div class="col-md-1">
               <label for="filter"  class="typo__label mb-0 text-dark" style="margin-top: 10px;">Filtrar por</label>
            </div>
              <div class="col-md-2">
                <select id="filter" v-model="filter" @change="getTasks(true)" class="form-control">
                      <option value="Mis Tareas" >Mis Tareas</option>
                      <option value="Suborbinados">Tareas de mis Suborbinado</option>
                </select>
              </div>
            <div class="col-md-1">
               <label for="filter"  class="typo__label mb-0 text-dark" style="margin-top: 10px;">Filtrar por Status</label>
            </div>
              <div class="col-md-2">
                <select id="filter" v-model="select_filter" @change="getTasks(true)" class="form-control">
                      <option value="">Seleccione</option>
                      <option value="Abierta" >Abierta</option>
                      <option value="Pendiente" >Pendiente</option>
                      <option value="Cerrada">Cerrada</option>
                </select>
              </div>

              <div  v-if="filter == 'Suborbinados'" class="col-md-1">
                 <label for="filter"  class="typo__label mb-0 text-dark" style="margin-top: 10px;">Filtrar por Suborbinado</label>
              </div>
                <div  v-if="filter == 'Suborbinados'" class="col-md-2">
                  <select id="filter" v-model="select_filter_subordinate" @change="getTasks(true)" class="form-control">
                        <option value="">Seleccione</option>
                        <option v-for="subordinate in subordinates" :value="subordinate.id" >{{subordinate.firstname+' '+subordinate.lastname}}</option>
                  </select>
                </div>
         

            </div>
            <div class="row">
              
            </div> 
          </div>   
         <br> 
          <table class="table table-responsive-sm table-striped">
           <thead >
            <tr>
              <th v-if="filter == 'Suborbinados'">Nombres de los Suborbinados</th>
              <th v-for="field in fields" :class="{true : field._classes }">{{field.label}}</th>
            </tr>
          </thead>
          <paginate name="items" :list="filterTableItems" :per="10" tag="tbody">
            <tr v-if="items.length == 0">
              <td :colspan="fields.length+1">
                <center>
                  <h4 style="margin: 0;">
                    Sin  registros
                  </h4>
                </center>
              </td>
            </tr>
            <tr v-for="item in paginated('items')">
              <td  v-if="filter == 'Suborbinados'" >{{item.subordinate}}</td> 
              <td>{{item.subject}}</td> 
              <template v-if="item.description.length > 65">
                <td v-html="item.description.substr(0,65)+'...</p>'"></td>
              </template>
              <template v-else>
                 <td v-html="item.description.substr(0,65)"></td>
              </template>
              <td v-html="has_customer(item.customer)"></td>  
              <td>{{item.date}}</td> 
               <td v-if ="item.status == 'Cerrada'">
                <span class="badge badge-danger">{{item.status}}</span>
              </td> 
               <td v-else-if ="item.status == 'Pendiente'">
                <span class="badge badge-primary">{{item.status}}</span>
              </td> 
              <td v-else>
                <span class="badge badge-success">{{item.status}}</span>
              </td> 
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
import { mapGetters,mapActions } from 'vuex'


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
      select_filter_subordinate:'',
      filter : '',
      filter_text : '',
      fields: [
        { key: "subject", label: "Tema",          _classes: "text-center" },
        { key: "description", label: "Descripción",          _classes: "text-center" },
        { key: "customer", label: "Cliente",          _classes: "text-center" },
        { key: "date",    label: "Fecha", _classes: "text-center" },
        { key: "status",    label: "Status", _classes: "text-center" },
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
    this.select_filter = 'Abierta'
    this.getTasks(true);
    this.getSubordinates();
    this.getParents()
    
  },
  computed: {
    ...mapGetters([
        'getUser'
    ]),
    filterTableItems: function(){
      return this.items.filter(item  => {
        return this.searchInObject(item, this.filter_text);
      });
    }
  },
  methods: {
  ...mapActions([
    'setParent'
  ]),
     searchInObject : function(object, input_text){
      for (let key in object){
        if(object[key] != null){

          if (typeof object[key] === 'object') {

            for (let key1 in object[key]){
              if (object[key].hasOwnProperty(key1) &&   (object[key].toString().toLowerCase().includes(input_text) || object[key].toString().includes(input_text))  ) {
                return true;
              }else{
                this.reset_page(this.paginate);
              }
            }
          }
          if (object.hasOwnProperty(key) &&   (object[key].toString().toLowerCase().includes(input_text) || object[key].toString().includes(input_text))  ) {
            return true;
          }else{
            this.reset_page(this.paginate);
          }
        }
      }
      return false;
    },
    has_customer  : function (customer) {
        if(customer == null){
          return '<span class="badge badge-primary">Sin cliente</span>';
        }else{
          return  '<a href="#/customers/'+customer.id+'/edit">'+customer.firstname +' '+customer.lastname+'</a>'
        }
    },
    getTasks(select = false) {
      this.items = [];

      if(this.filter == 'Suborbinados'){
        
        if (this.subordinates.length == 0) {
          return;
        }
        let user_ids;

        if (this.select_filter_subordinate != '') {
           user_ids = [this.select_filter_subordinate];
        }else{
           user_ids = this.subordinates.map(subordinate => {
            return { id: subordinate.id };
          });
        }

        let url =  select == true && this.select_filter != '' ? this.current_endpoint+'/subordinate/'+this.select_filter :  this.current_endpoint+'/subordinate';
         
        axios
          .post(url,{user_ids : user_ids})
          .then(resp => {

            if(this.filter == 'Suborbinados'){ 
             this.items = resp.data.filter((thing, index) => {
              const _thing = JSON.stringify(thing);
              return index ===  resp.data.findIndex(obj => {
                return JSON.stringify(obj) === _thing;
              });
            });
            
            
              this.items.forEach((data, index) => {
                let subordinate = ''
                data.users.forEach((data) => {
                  if (this.getUser.id != data.id) {
                    subordinate += data.firstname+' '+data.lastname+','
                  }
                })
                this.items[index].subordinate = subordinate.substr(0,subordinate.length-1)
              });
            }else{
              this.items = resp.data
            }
            
            this.reset_page(this.paginate)
          })
          .catch(err => console.log(err));

      }else{
        
         let url =  select == true && this.select_filter != '' ? this.current_endpoint+'/'+this.select_filter+'/status' :  this.current_endpoint;
        
         axios
          .get(url)
          .then(resp => {
            //this.items = resp.data;
            console.log(resp.data)

            this.items = resp.data.filter((thing, index) => {
              const _thing = JSON.stringify(thing);
              return index ===  resp.data.findIndex(obj => {
                return JSON.stringify(obj) === _thing;
              });
              });
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