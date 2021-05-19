<template>
  <div>
    
      <CCollapse :show="collapseInformation">
        <formGenerator
          :items="itemsInformationCollapse"
          :entity="entityFormCollapse"
          :buttonHidden="!collapseInformation">
          <span @click="collapse()"> Cliente<CIcon :content="$options.ArrowRigth"/></span> 
          
        </formGenerator>
      </CCollapse>
     
      <CCollapse :show="!collapseInformation">
        <formGenerator
          :items="itemsInformation"
          :entity="entityForm"
          @update="updated()">
          <span @click="collapse()">Editar Cliente<CIcon :content="$options.ArrowBottom "/></span>
        </formGenerator>
      </CCollapse>
      
      <formGenerator
        :items="itemsAddresses"
        :entity="entityFormAddress"
        :hasCollapse="false"
        @update="createOrUpdateAddress()"
        @change="change($event)"
        @enter="enter($event)"
        ref="addresses">
        <span @click="arrow()">Direcciones
         <CIcon v-if="content_address" :content="$options.ArrowBottom"></CIcon>
         <CIcon v-else :content="$options.ArrowRigth"></CIcon>
        </span>
      </formGenerator>
    
     <CRow>
 
         <CCard class="col-sm-12 col-md-12">
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

      <div class="col-sm-12 col-md-6">
        <TaskTable v-bind:customer_id="customerId"></TaskTable>

      </div>
       <CCard class="col-md-6">
          <CCardHeader class="text-success py-1">
            <strong>Equipo</strong>
          </CCardHeader>
          <CCardBody>
            <CRow>
              <div v-for="user in attachedUsers" class="mr-2 text-success text-center" data-title="Seleccionar como responsable"   @click="setUserResponsable(user.id)">
                <img width="70px" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSE985qTr1hauge-1nv0jJbyFmZL5j_R9U-Ug&usqp=CAU"><br>
                <small>
                  <strong>{{ user.firstname + ' ' + user.lastname }}</strong>
                </small>
                <br>
                 <span v-if="user.pivot.is_responsable" class="badge badge-primary">Responsable</span>
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
        <div class="col-sm-6 col-md-6">
          <RelationshipsTable v-bind:customer_id="customerId"></RelationshipsTable>
        </div>

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
import TaskTable from "@/views/tasks/components/TaskTable.vue";
import RelationshipsTable from "@/views/relationships/components/RelationshipsTable.vue";
import { cilArrowRight,cilArrowBottom } from '@coreui/icons'
import Swal from 'sweetalert2/dist/sweetalert2.js'

const Toast = Swal.mixin({
  toast: true,
  position: 'top',
  showConfirmButton: false,
  timer: 4000,
  timerProgressBar: true,
  onOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  }
});

const HTTP_OK = 200;
const HTTP_CREATED = 201;

export default {
  ArrowRigth: cilArrowRight,
  ArrowBottom: cilArrowBottom,
  name: "CustomerEdit",
  components: { 
    formGenerator,
    ProductTable,
    InteractionTable,
    TaskTable,
    RelationshipsTable
  },
  data() {
    return {
      entity: "Clientes",
      collapseAddress : true,
      content_address : false,
      collapseInformation : true,
      selectedUsers: [],
      attachedUsers: [],
      users: [],
      newEntity: "Nuevo Cliente",
      itemsInformationCollapse: items.informationCollapse,
      itemsInformation: items.information,
      itemsAddresses: items.addresses,
      customerId: 0,
      interactions: [],
      products: [],
      unit_ids : [],
      entityFormCollapse: {
        firstnameCollapse: "",
        lastnameCollapse: "",
      },
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
    arrow(){
      this.content_address =! this.content_address;
    },
    collapse(){
      this.collapseInformation =! this.collapseInformation;
    },
    getCustomerById() {
      axios.get(`v1/customers/${this.customerId}`).then(res => {
        this.setCustomerInformation(res.data);
        this.getOrganizations()
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

    getOrganizations(){
       axios.get('organizations/mine')
        .then(resp => {

          let organizations = resp.data
          for (var i = 0; i < organizations.length; i++) {
            this.unit_ids.push(organizations[i].unit_id)
          }

          this.getUsers(); 
          resolve(resp)
        })
        .catch(err => {
          //commit('auth_error', err)
          //reject(err)
        });
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
            Toast.fire({
              icon: 'success',
              title: 'Operación completada',
            })
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

      this.entityFormCollapse = {
        firstnameCollapse:   data.firstname,
        lastnameCollapse:    data.lastname,
      };

      this.entityForm = { ...this.entityForm };
    },
    updated() {
      console.log(this.entityForm);
       axios
         .put(`v1/customers/${this.customerId}`, this.entityForm)
         .then(res => {

           if (res.status == HTTP_OK) {
            Toast.fire({
              icon: 'success',
              title: 'Operación completada',
            })
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
            Toast.fire({
              icon: 'success',
              title: 'Operación completada',
            })
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
    setUserResponsable(user_id)
    {
      const HTTP_OK = 200;

      axios
        .put(`v1/customers/${this.customerId}/responsable/${user_id}`)
        .then(res => {
          if (res.status == HTTP_OK) {
            Toast.fire({
              icon: 'success',
              title: 'Operación completada',
            })
            this.getAttachedUsers()
            //this.$router.go(-1)
          }
        })
        .catch(err => console.log(err));
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


  [data-title]:hover:after {
    opacity: 1;
    transition: all 0.1s ease 0.5s;
    visibility: visible;
}

[data-title]:after {
    content: attr(data-title);
    background-color: #3c4b64;
    color: rgba(255, 255, 255, 0.8);
    font-size: 14px;
    position: absolute;
    padding: 3px 20px;
    bottom: -1.6em;
    left: 100%;
    white-space: nowrap;
    box-shadow: 1px 1px 3px #222222;
    opacity: 0;
    border: 1px solid #111111;
    z-index: 99999;
    visibility: hidden;
    border-radius: 6px;
    
}
[data-title] {
    position: relative;
}
</style>