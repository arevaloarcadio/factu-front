
<template>
  <div>
    <CCard>
      <CCardHeader>
        <h5>
          {{ entity }}
          <router-link :to="{ name: 'product_types.create' }">
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
              <td>{{item.name}}</td> 
              
              <router-link :to="{ name: 'product_types.edit', params: { id: item.id } }">
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

export default {
  name: "ProductTypePage",
  components: {},
  data() {
    return {
      entity: "Tipo de Producto",
      newEntity: "Nuevo Tipo de Producto",
      entityTable: "product_type",
      items: [],
      paginate : ['items'],
      fields: [
        { key: "name", label: "Nombre", _classes: "text-center" },
        {
          key: 'actions',
          label: 'Acciones',
          _style: { width: '1%' },
          sorter: false,
          filter: false
        }
      ],
    };
  },
  created() {
      this.getProductTypes();
  },
  mounted() {},
  methods: {
      getProductTypes() {
      
      axios
        .get("product_types")
        .then(res => {
          this.items = res.data;
          this.setProductTypes(this.items);
        })
        .catch((err) => console.log(err));
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