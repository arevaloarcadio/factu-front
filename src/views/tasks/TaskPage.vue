
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
        <CDataTable
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
  name: "TaskPage",
  components: {},
  data() {
    return {
      entity: "Tareas",
      newEntity: "Nueva Tarea",
      entityTable: "tasks",
      items: [],
      tableFields: [
        { key: "customer",      label: "Cliente" },
        { key: "product_types", label: "Tipo",          _classes: "text-center" },
        { key: "identifier",    label: "Identificador", _classes: "text-center" },
      ],
      previousUrl: "",
      nextUrl: "",
    };
  },
  created() {
    this.getProducts();
  },
  mounted() {},
  methods: {
    getProducts() {
      
      axios
        .get("products")
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