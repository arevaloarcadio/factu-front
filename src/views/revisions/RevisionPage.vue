
<template>
  <div>
    <CCard>
      <CCardHeader>
        <!--<h5>
          {{ entity }}
          <router-link :to="{ name: 'revision.create' }">
            <CButton class="float-right py-0 mr-1" color="success">
              <CIcon name="cil-pencil" class="mr-2 cil-energy"></CIcon>
              {{ newEntity }}
            </CButton>
          </router-link>
        </h5>-->
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
              <td><a :href="'#/customers/'+item.id+'/edit'">{{item.firstname +' '+item.lastname}}</a></td> 
              <td>{{item.email}}</td> 
              <td>{{item.revision_time +' dias'}}</td> 
              <td>{{item.days_difference+' dias'}}</td> 
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
  name: "RevisionPage",
  components: {},
  data() {
    return {
      entityTable: "revisions",
      items: [],
      paginate : ['items'],
      fields: [
        { key: "name", label: "Nombre y Apellido",_classes: "text-center" },
        { key: "email", label: "Correo Electrónico",_classes: "text-center" },
        { key: "revision_time", label: "Tiempo de Revisión",_classes: "text-center" },
        { key: "days_difference", label: "Dias sin interacción",_classes: "text-center" },
      ],
      previousUrl: "",
      nextUrl: "",
    };
  },
  created() {
    this.getCustomers();
  },
  mounted() {},
  methods: {
    getCustomers() {
      
      axios
        .get('v1/customers/revision')
        .then(resp => {
          this.items = resp.data;
        })
        .catch(err => console.log(err));
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