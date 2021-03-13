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

    <CCard>
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
  </div>
</template>

<script>
import axios from "axios";
import VueNotifications from "vue-notifications";
import formGenerator from "@/views/components/formGenerator.vue";
import ProductTable from "@/views/products/components/ProductTable.vue";
import items from "./customer-edit-items";


const HTTP_OK = 200;
const HTTP_CREATED = 201;

export default {
  name: "CustomerEdit",
  components: { 
    formGenerator,
    ProductTable
  },
  data() {
    return {
      entity: "Clientes",
      newEntity: "Nuevo Cliente",
      itemsInformation: items.information,
      itemsAddresses: items.addresses,
      customerId: null,
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
    this.getProducts();

    Promise.all([
      this.addressesByCustomerId(),
      this.countries(),
    ]).catch(err => console.log(err)); 
  },
  methods: {
    getCustomerById() {
      const customerId = this.$route.params.id;

      axios.get(`v1/customers/${customerId}`).then(res => {
        this.setCustomerInformation(res.data);
      }).catch(err => console.log(err));

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
      const customerId   = this.$route.params.id;
      
      axios
        .put(`v1/customers/${customerId}`, this.entityForm)
        .then(res => {

          if (res.status == HTTP_OK) {
            this.$router.go(0);
            this.showSuccessMsg();
          }
        })
        .catch(err => console.log);
    },
    createOrUpdateAddress() {
      const customerId   = this.$route.params.id;

      const address = {
        id:         this.entityFormAddress.id,
        customerId,
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
      const customerId = this.$route.params.id;

      return new Promise((resolve, reject) => {
        axios.get(`v1/customers/${customerId}/addresses`)
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
