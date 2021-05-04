<template>
  <div>
    <CCard>
      <CCardHeader>
        <h5>
          Usuarios
          <router-link :to="{ name: 'users.create' }">
            <CButton class="float-right py-0 mr-1" color="success">
              <CIcon name="cil-pencil" class="mr-2 cil-energy"></CIcon>
              Nuevo Usuario
            </CButton>
          </router-link>
        </h5>
      </CCardHeader>

      <CCardBody class="py-2" v-if="items">

        <table class="table table-responsive-sm table-striped">
           <thead >
            <tr>
              <th v-for="field in tableFields" :class="{true : field._classes !== undefined }">{{field.label}}</th>
            </tr>
          </thead>
          <paginate name="items" :list="items" :per="10" tag="tbody">
            <tr v-if="items.length == 0">
                <td :colspan="tableFields.length">
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
              <td v-if="item.admin" class="text-center">
                <CIcon
                  name="cil-check"
                  style="color:green;"
                  height="25"
                  v-show="item.admin"/>
              </td>
              <td v-else class="text-center">
              </td>
              <td slot="actions">
                <router-link :to="{ name: 'users.edit', params: { id: item.id } }">
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
          :fields="tableFields"
          head-color="light"
          no-sorting
          v-if="items">

          <td slot="name" slot-scope="{ item }">
            {{ item.name }}
          </td>
          <td slot="admin" slot-scope="{ item }" class="text-center">
            <CIcon
              name="cil-check"
              style="color:green;"
              height="25"
              v-show="item.admin"/>
          </td>
          <td slot="actions" slot-scope="{ item }">
            <router-link :to="{ name: 'users.edit', params: { id: item.id } }">
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
              </a
              >
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
import formGenerator from "@/views/components/formGenerator.vue";
import VuePaginate from 'vue-paginate'

export default {
  name: "UserPage",
  components: { formGenerator },
  data() {
    return {
      items: [],
      paginate : ['items'],
      submitted: false,
      itemModal: false,
      tableFields: [
        { key: "firstname", label: "Nombre" },
        { key: "lastname", label: "Apellidos" },
        { key: "email", label: "Email", _classes: "text-center" },
        { key: "admin", label: "Administrador", _classes: "text-center" },
        {
          key: 'actions',
          label: 'Acciones',
          _style: { width: '1%' },
          sorter: false,
          filter: false
        },
      ],
      previousUrl: "",
      nextUrl: "",
    };
  },
  created() {
    this.getUsers();
  },
  methods: {
    getUsers() {

      axios
        .get("users")
        .then(res => {
          this.items = res.data;
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
          t.items = resp.data;
          if (resp.data.next_page_url) {
            t.nextUrl = resp.data.next_page_url;
          } else {
            t.nextUrl = "";
          }
          if (resp.data.prev_page_url) {
            t.previousUrl = resp.data.prev_page_url;
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
