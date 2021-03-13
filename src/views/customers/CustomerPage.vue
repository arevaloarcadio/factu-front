<template>
  <div>
    <CCard>
      <CCardHeader>
        <h5>
          {{ entity }}
          <router-link :to="{ name: 'customers.create' }">
            <CButton class="float-right py-0 mr-1" color="success">
              <CIcon name="cil-pencil" class="mr-2 cil-energy"></CIcon>
              {{ newEntity }}
            </CButton>
          </router-link>
        </h5>
      </CCardHeader>

      <CCardBody class="py-2" v-if="items">
        <CDataTable
          class="mb-0 table-outline"
          hover
          :items="items"
          :fields="fields"
          head-color="light"
          no-sorting
          v-if="items">
          <td slot="actions" slot-scope="{ item }">
            <router-link :to="{ name: 'customers.edit', params: { id: item.id } }">
              <CButton class="m-2 btn--link" size="sm" color="warning">Editar</CButton>
            </router-link>
          </td>
        </CDataTable>
      </CCardBody>

      <CCardFooter v-if="items">
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
      </CCardFooter>
    </CCard>
  </div>
</template>

<script>
import axios from "axios";
import VueNotifications from "vue-notifications";

export default {
  name: "CustomerPage",
  data() {
    return {
      entity: "Clientes",
      newEntity: "Nuevo Cliente",
      entityTable: "customers",
      items: [],
      fields: [
        { key: "firstname", label: "Nombre" },
        { key: "lastname",  label: "Apellidos",          _classes: "text-center" },
        { key: "email",     label: "Correo electrónico", _classes: "text-center" },
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
    this.getCustomers();
  },
  methods: {
    getCustomers() {

      axios
        .get('v1/customers')
        .then((resp) => {
          this.items = resp.data;
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