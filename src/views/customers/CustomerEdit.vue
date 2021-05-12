<template>
  <div>
    <formGenerator
      :items="itemsInformation"
      :entity="entityForm"
      @update="updated()">
      Editar Cliente
    </formGenerator>

    <formGenerator
      :items="itemsAddresses"
      :entity="entityFormAddress"
      @update="createOrUpdateAddress()"
      @change="change($event)"
      @enter="enter($event)">
      Direcciones
    </formGenerator>
    <CRow>
      <CCard class="col-sm-12 col-md-6">
        <CCardHeader>
          <h5>
            Productos
            <router-link :to="{ name: 'products.create', params: { id: customerId } }">
            <CButton class="float-right py-0 mr-1" color="success">
              <CIcon name="cil-pencil" class="mr-2 cil-energy"></CIcon>
              Nuevo Producto
            </CButton>
            </router-link>
          </h5>
        </CCardHeader>

        <CCardBody class="py-2">
          
          <ProductTable :items="products"></ProductTable>
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
      <CCard class="col-sm-12 col-md-6">
        <CCardHeader>
          <h5>
            Interacciones
            <router-link :to="{ name: 'interactions.create', params: { customerId } }">
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
      <CCard class="col-md-12">
          <CCardHeader class="text-success py-1">
            <strong>Equipo</strong>
          </CCardHeader>
          <CCardBody>
            <CRow>
              <div v-for="user in attachedUsers" class="mr-2 text-success text-center">
                <img width="70px" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSE985qTr1hauge-1nv0jJbyFmZL5j_R9U-Ug&usqp=CAU"><br>
                <small>
                  <strong>{{ user.firstname + ' ' + user.lastname }}</strong>
                </small>
              </div>
            </CRow>
          </CCardBody>
          <CCardFooter>
            <CRow>
              <CCol class="col-md-3">
                <label for="user" class="strong"><strong>Usuarios:</strong></label>
              </CCol>
              <CCol class="col-md-6">
                <multiselect v-model="selectedUsers"placeholder="Introduzca Nombre"  :options="users.map(type => type.id)"
                    :custom-label="opt => users.find(x => x.id == opt).firstname + ' '+ users.find(x => x.id == opt).lastname" :show-labels="false" :option-height="30" 
                    id="user" name="user" :multiple="true" :hide-selected="true">
                </multiselect>
              </CCol>
              <CCol class="col-md-3">
                  <button @click="attachUsers" class="btn btn-primary float-left">Añadir</button>
              </CCol>
            </CRow>
          </CCardFooter>
        </CCard>
    </CRow>
  </div>
</template>

<script>
import axios from "axios";
import VueNotifications from "vue-notifications";
import formGenerator from "@/views/components/formGenerator.vue";
import ProductTable from "@/views/products/components/ProductTable.vue";
import items from "./customer-edit-items";
import InteractionTable from "@/views/interactions/components/InteractionTable.vue";


const HTTP_OK = 200;
const HTTP_CREATED = 201;

export default {
  name: "CustomerEdit",
  components: { 
    formGenerator,
    ProductTable,
    InteractionTable
  },
  data() {
    return {
      entity: "Clientes",
      selectedUsers: [],
      attachedUsers: [],
      users: [],
      newEntity: "Nuevo Cliente",
      itemsInformation: items.information,
      itemsAddresses: items.addresses,
      customerId: 0,
      interactions: [],
      products: [],
      entityForm: {
        firstname: "",
        lastname: "",
        // address: "",
        birthdate: "",
        phone: "",
        cellphone: "",
        email: "",
        description: "",
      },
      entityFormAddressArr: [],
      entityFormAddress: {
        id: null,
        country: "",
        province: "",
        city: "",
        address: "",
        zipCode: ""
      },
    };
  },
  created() {

    this.customerId = this.$route.params.id;
    
    this.getCustomerById();


    Promise.all([
      this.addressesByCustomerId(),
      this.countries(),
    ]).catch(err => console.log(err));
  },
  methods: {
    
    getCustomerById() {
      axios.get(`v1/customers/${this.customerId}`).then(res => {
        this.setCustomerInformation(res.data);
        this.getUsers();
        this.getProducts();
        this.getInteractions();
        this.getAttachedUsers();
      }).catch(err => {
        console.log(err)
        this.$router.go(-1)
      });

    },

    getInteractions() {      
      axios
        .get(`v1/customers/${this.customerId}/interactions`)
        .then(res => {
          this.interactions = res.data;
        })
        .catch(err => console.log(err));
    },

    getUsers() {      
      axios
        .get(`users`)
        .then(res => {
          this.users = res.data;
        })
        .catch(err => console.log(err));
    },

    getAttachedUsers() {
      axios
        .get(`v1/customers/${this.customerId}/users`)
        .then(res => {
          console.log(res.data);
          this.attachedUsers = res.data
        })
        .catch(err => console.log(err));
    },
    attachUsers() {
      const HTTP_CREATED = 201;
      
      const users = {
        users:  this.selectedUsers
      };
      
      axios
        .post(`v1/customers/${this.customerId}/users`, users)
        .then(res => {
          this.getAttachedUsers();
          this.selectedUsers = null;
        })
        .catch(err => console.log(err));

    },

    setCustomerInformation(data) {
      this.entityForm = {
        firstname:   data.firstname,
        lastname:    data.lastname,
        cif:         data.cif,
        birthdate:   data.birthdate,
        phone:       data.phone,
        cellphone:   data.cellphone,
        email:       data.email,
        description: data.description,
      };

      this.entityForm = { ...this.entityForm };
    },
    updated() {
      console.log(this.entityForm);
       axios
         .put(`v1/customers/${this.customerId}`, this.entityForm)
         .then(res => {

           if (res.status == HTTP_OK) {
             this.$router.go(0);
            // this.showSuccessMsg();
           }
         })
         .catch(err => console.log);
    },
    createOrUpdateAddress() {
      const address = {
        id:         this.entityFormAddress.id,
        customerId: this.customerId,
        countryId:  this.entityFormAddress.country,
        provinceId: this.entityFormAddress.province,
        cityId:     this.entityFormAddress.city,
        zipCodeId:  this.entityFormAddress.zipCode,
        address:    this.entityFormAddress.address,
      };

      axios
        .post(`v1/addresses`, address)
        .then(res => {

          if (res.status == HTTP_OK) {
            this.$router.go(0);
            this.showSuccessMsg();
          }
        })
        .catch(err => console.log);
    },
    addressesByCustomerId() {
      return new Promise((resolve, reject) => {
        axios.get(`v1/customers/${this.customerId}/addresses`)
          .then(res => {
            this.setAddressInformation(res.data)
            resolve(true);
          }).catch(err => reject(err));
      });
    },
    getProducts() {
      
      axios
        .get(`v1/customers/${this.customerId}/products`)
        .then(resp => {
          this.products = resp.data;
          // console.log(resp);
        })
        .catch(err => console.log(err));
    },

    // events
    change($event) {
      const COUNTRY  = "country";
      const PROVINCE = "province";
      const CITY     = "city";
      console.log($event);

      switch ($event.name) {
        case COUNTRY:
          this.provinces($event.value);
          break;
        case PROVINCE:
          this.cities($event.value);
          break;
        case CITY:
          this.postalCodes($event.value);
          break;

        default:
          break;
      }
    },
    enter($event) {
      const INPUT_NAME = "zipCode";

      if ($event.name === INPUT_NAME) {
      }
      console.log($event);
    },

    // addresses
    countries() {
      return new Promise((resolve, reject) => {
        
        axios.get("v1/countries").then((resp) => {
          this.setCountries(resp.data);
          resolve(true);
        }).catch(err => reject(err));
      });
    },
    provinces(countryId) {
      axios.get(`v1/countries/${countryId}/provinces`).then((resp) => {
        this.setProvinces(resp.data);
      });
    },
    cities(provinceId) {
      axios.get(`v1/provinces/${provinceId}/cities`).then((resp) => {
        this.setCities(resp.data);
      });
    },
    postalCodes(cityId) {
      axios.get(`v1/cities/${cityId}/postal-codes`).then((resp) => {
        this.setPostalCodes(resp.data);
      });
    },

    // setters
    setAddressInformation(addresses) {

      this.entityFormAddressArr = addresses;
      if(addresses[0] == null){
        return
      }
      this.entityFormAddress = {
        id:       addresses[0].id,
        country:  addresses[0].country_id,
        province: addresses[0].province_id,
        city:     addresses[0].city_id,
        zipCode:  addresses[0].postal_code_id,
        address:  addresses[0].line_one
      }

      this.entityFormAddress = { ...this.entityFormAddress };
      this.provinces(this.entityFormAddress.country);
      this.cities(this.entityFormAddress.province);
      this.postalCodes(this.entityFormAddress.city);
    },
    setCountries(countries) {
      this.itemsAddresses[0].campos[1].opciones = countries;
      this.itemsAddresses = { ...this.itemsAddresses };
    },
    setProvinces(provinces) {
      this.itemsAddresses[0].campos[2].opciones = provinces;
      this.itemsAddresses = { ...this.itemsAddresses };
    },
    setCities(provinces) {
      this.itemsAddresses[0].campos[3].opciones = provinces;
      this.itemsAddresses = { ...this.itemsAddresses };
    },
    setPostalCodes(postalCodes) {
      this.itemsAddresses[0].campos[5].opciones = postalCodes;
      this.itemsAddresses = { ...this.itemsAddresses };
    },
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
  },
};

</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style type="text/css">
  #zipCode{
    margin-top: 6%;
  }
</style>