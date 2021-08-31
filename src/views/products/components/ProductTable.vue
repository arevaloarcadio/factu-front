
<template>
  <div>
    <div class="controls">
      <div class="row">
        <div class="col-md-1">
           <label for="filter"  class="typo__label mb-0 text-dark" style="margin-top: 10px;">Estatus</label>
        </div>
          <div class="col-md-4">
            <select id="filter" @change="onChange()" v-model="filter" class="form-control">
                  <option value="Activo" selected="true">Activo</option>
                  <option value="No Activo">No Activo</option>
                  <option value="Anulado">Anulado</option>
                  <option value="En Riesgo">En Riesgo</option>
                  <option value="Finalizado">Finalizado</option>
            </select>
          </div>
        </div>
     </div>   
    <table class="table table-responsive-sm table-striped">
     <thead>
      <tr>
        <th v-for="field in tableFields" :class="{true : field._classes }">{{field.label}}</th>
      </tr>
    </thead>
    <paginate name="items" :list="items" :per="5" tag="tbody">
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
        <td>{{item.product_types.name }}</td> 
         <td>{{item.price }} €</td>
        <td>{{item.identifier }}</td>
        <router-link :to="{ name: 'products.edit', params: getParams(item), query: getQuery(item) }">
          <CButton class="m-2 btn--link" size="sm" color="warning">Editar</CButton>
        </router-link>
          <CButton class="m-2 btn--link" size="sm" color="danger" @click="delete_item(item)">Quitar</CButton>
      </tr>
    </paginate>

  </table>
    <div> <h5 style="margin: 0;"> Sumatoria: {{sum_products}} €</h5></div><br>
  <paginate-links for="items" :limit="5" :show-step-links="true" :classes="{'ul': 'pagination', 'li': 'page-item', 'a': 'page-link'}"></paginate-links>
    <!--<CDataTable
      class="mb-0 table-outline"
      hover
      :items="items"
      :fields="tableFields"
      head-color="light"
      no-sorting
      v-if="items">

      <td slot="customer" slot-scope="{ item }">
        {{ item.customer.firstname }} {{ item.customer.lastname }}
      </td>
      <td slot="product_types" slot-scope="{ item }">
        {{ item.product_types.name }}
      </td>
      <td slot="actions" slot-scope="{ item }">
        <router-link :to="{ name: 'products.edit', params: getParams(item), query: getQuery(item) }">
          <CButton class="m-2 btn--link" size="sm" color="warning">Editar</CButton>
        </router-link>
      </td>
    </CDataTable>-->
  </div>
</template>

<script>
import axios from 'axios'
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


export default {
  name: "ProductTable",
  props: ["items","sum_products"],
  data() {
    return {
      paginate : ['items'],
      entityTable: "products",
      filter : 'Activo',
      tableFields: [
        { key: "product_types", label: "Tipo",          _classes: "text-center" },
        { key: "price",    label: "Precio", _classes: "text-center" },
        { key: "identifier",    label: "Identificador", _classes: "text-center" },
        {
          key: 'actions',
          label: 'Acciones',
          _style: { width: '1%' },
          sorter: false,
          filter: false
        },
      ],
    };
  },
  methods: {
    getParams(item) {
      return { 
        customerId : item.customer_id,
        productId  : item.id ,
        status     : item.status
      };
    },
    getQuery(item) {
      return { 
        identifier  : item.identifier, 
        product_type: item.product_type_id ,
        status      : item.status,
        price       : item.price
      };
    },
    delete_item(product){

      Swal.fire({
        width: 600,
        title: 'Confirmación de eliminación del producto',
        icon: 'warning',
        html:  'Esta a punto de eliminar el producto <b>'+product.product_types.name+'</b> al cliente <b>'+product.customer.firstname+' '+product.customer.lastname+'</b>',
        showCancelButton: true,
        confirmButtonText: 'Eliminar',
        confirmButtonColor : '#e55353',
        cancelmButtonText: 'Cancelar',
        showLoaderOnConfirm: true,
        preConfirm: () => {
          return axios
            .delete("products/delete/"+product.id)
            .then(response => {
              return response.data;
            })
            .catch(error => {
                  //console.log(error.status )
              Swal.showValidationMessage(
               `Request fail: ${error}`
              )
              /*if(error.response?.data.error.status_code == '422') {
                Swal.showValidationMessage(
                   `${error.response.data.error.message.error}`
                 )
              }else{
                  Swal.showValidationMessage(
                   `Request fail: ${error}`
                 )
              }*/
            });
        },
        allowOutsideClick: () => !Swal.isLoading()
      }).then(result => {
          if(result.value){
            this.$emit("delete")
            Toast.fire({
              icon: 'success',
              title: 'EL PRODUCTO DEL CLIENTE HA SIDO ELIMINADO'
            });
          }
      });

    },
    onChange (){
      this.$emit("change",this.filter);
      this.reset_page(this.paginate);
    },
    reset_page : function (paginate){
      for(let pag in paginate){
        paginate[pag].page = 0;
      }
    },
  }
};
</script>

<style lang="scss" scoped>
.btn--link { color: #FFF }
</style>

<style scoped>
  .swal2-cancel{
    margin-left: 1px;
  }
</style>