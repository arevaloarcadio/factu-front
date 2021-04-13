<template>
  <div>
    <CRow>
      <formGenerator
        class="col-sm-12 col-md-6"
        :items="itemsForm" 
        :entity="entityForm" 
        @update="updateUser()">
        Editar Usuario
      </formGenerator>

      <formGenerator
        class="col-sm-12 col-md-6"
        :items="itemsSecurity" 
        :entity="entityFormPassword" 
        @update="updatePassword()">
        Seguridad
      </formGenerator>
    </CRow>
    <CCard>
      <CCardHeader>
        <h5>
          Interacciones
          <router-link :to="{ name: 'interactions.create', params: { userId } }">
          <CButton class="float-right py-0 mr-1" color="success">
            <CIcon name="cil-pencil" class="mr-2 cil-energy"></CIcon>
            Nueva Interacción
          </CButton>
          </router-link>
        </h5>
      </CCardHeader>

      <CCardBody class="py-2">
        
        <InteractionTable :items="interactions"></InteractionTable>
      </CCardBody>
      <!-- <CCardFooter v-if="products">
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
              <a class="page-link" @click="page(nextUrl)" v-show="nextUrl">Siguiente</a>
            </li>
          </ul>
        </nav>
      </CCardFooter> -->
    </CCard>
  </div>
</template>

<script>
import axios from 'axios';
import VueNotifications from "vue-notifications";
import formGenerator from "@/views/components/formGenerator.vue";
import InteractionTable from "@/views/interactions/components/InteractionTable.vue";
import items from './user-edit-items';

export default {
  name: "UserEdit",
  components: { 
    formGenerator,
    InteractionTable
  },
  data() {
    return {
      userId: null,
      interactions: [],
      itemsForm: items.information,
      itemsSecurity: items.security,
      entityForm: {
        firstname: "",
        lastname: "",
        email: "",
      },
      entityFormPassword: {
        password: "",
        password_confirmation: "",
      },
    };
  },
  created() {

    this.userId = this.$route.params.id;

    this.getUser();
    this.getInteractions();
  },
  methods: {
    getUser() {
      const userId = this.$route.params.id;
      
      axios
        .get(`v1/users/${userId}`)
        .then(res => {
          this.setUserInformation(res.data);
        })
        .catch(err => console.log(err));
    },
    getInteractions() {
      const userId = this.$route.params.id;
      
      axios
        .get(`v1/users/${userId}/interactions`)
        .then(res => {
          this.interactions = res.data;
        })
        .catch(err => console.log(err));
    },
    updateUser() {
      const HTTP_OK = 200;
      const userId  = this.$route.params.id;
      
      axios
        .put(`v1/users/${userId}`, this.entityForm)
        .then(res => {
          console.log(res.data);

          if (res.status == HTTP_OK) {
            // this.showSuccessMsg();
            this.$router.go(-1);
          }
        })
        .catch(err => console.log(err));
    },
    updatePassword() {
      const HTTP_OK = 200;
      const userId  = this.$route.params.id;
      
      axios
        .put(`v1/users/${userId}/password`, this.entityFormPassword)
        .then(res => {
          console.log(res.data);

          if (res.status == HTTP_OK) {
            // this.showSuccessMsg();
            this.$router.go(-1);
          }
        })
        .catch(err => console.log(err));
    },
		
		
		// setters
    
    setUserInformation(user) {
      // this.entityForm.firstname = user.firstname;
      // this.entityForm.lastname  = user.lastname;
      // this.entityForm.email     = user.email;

      this.entityForm = { ...user };
    }
  },
  notifications: {
    showSuccessMsg: {
      type: VueNotifications.types.success,
      title: "Operación completada",
      message: "Registro añadido con éxito!",
    },
    showErrorMsg: {
      type: VueNotifications.types.error,
      title: "Operación rechazada",
      message: "Algo salió mal",
    },
  }
};
</script>
