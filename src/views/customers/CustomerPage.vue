<template>
  <div>
    <CCard>
      <CCardHeader>
        <h5>
          {{ entity }}
          <router-link  :to="{ name: 'customers.create' }">
            <CButton class="float-right py-0 mr-1" color="success">
              <CIcon name="cil-pencil" class="mr-2 cil-energy"></CIcon>
              {{ newEntity }}
            </CButton>
          </router-link>
        </h5>
      </CCardHeader>
      <div class="controls">
        <CCol class="col-md-3">
         <input class="form-control"  size="50" placeholder="Buscar Cliente" v-model="filter" type="text"><span class="input-group-append"></span>
        </CCol>
      </div>
      <CCardBody class="py-2" v-if="items">
       
        <table class="table table-responsive-sm table-striped">
           <thead >
            <tr>
              <th v-for="field in fields" :class="{true : field._classes !== undefined }">{{field.label}}</th>
            </tr>
          </thead>
          <paginate name="items" :list="filterTableItems" :per="10" tag="tbody">
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
              <td>{{item.firstname}}</td> 
              <td>{{item.lastname}}</td> 
              <td>{{item.email}}</td> 
              <td>{{item.status}}</td> 
              <td slot="actions">
                <router-link :to="{ name: 'customers.edit', params: { id: item.id } }">
                  <CButton class="m-2 btn--link" size="sm" color="warning">Editar</CButton>
                </router-link>
              </td>    
            </tr>
          </paginate>
        </table>
         
         <paginate-links for="items" :limit="10" :show-step-links="true" :classes="{'ul': 'pagination', 'li': 'page-item', 'a': 'page-link'}"></paginate-links>
              
   
      </CCardBody>

    </CCard>
  </div>
</template>

<script>
import axios from "axios";
import VueNotifications from "vue-notifications";
import VuePaginate from 'vue-paginate'

export default {
  name: "CustomerPage",
  data() {
    return {
      entity: "Clientes",
      newEntity: "Nuevo Cliente",
      entityTable: "customers",
      items: [],
      paginate : ['items'],
      filter : "",
      fields: [
        { key: "firstname", label: "Nombre" },
        { key: "lastname",  label: "Apellidos",          _classes: "text-center" },
        { key: "email",     label: "Correo electrónico", _classes: "text-center" },
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
  computed:{
    filterTableItems: function(){
      return this.items.filter(item  => {
        return this.searchInObject(item, this.filter);
      });
    }
  },
  mounted() {
    this.getCustomers();
  },
  methods: {
    reset_page : function (paginate){
      for(let pag in paginate){
        paginate[pag].page = 0;
      }
    },
     searchInObject : function(object, input_text){
      for (let key in object){
        if(object[key] != null){
          if (object.hasOwnProperty(key) &&  object[key].toString().toLowerCase().includes(input_text)  ) {
            return true;
          }else{
            this.reset_page(this.paginate);
          }
        }
      }
      return false;
    },
    getCustomers() {

      axios
        .get('v1/customers')
        .then(res => {
          this.items = res.data;;
        })
        .catch(err => console.log);
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