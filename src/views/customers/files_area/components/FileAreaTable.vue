
<template>
  <div>

 <table class="table table-responsive-sm table-striped">
     <thead>
      <tr>
        <th v-for="field in tableFields" :class="{true : field._classes }">{{field.label}}</th>
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
         <td slot="user">
           <img width="70px" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSE985qTr1hauge-1nv0jJbyFmZL5j_R9U-Ug&usqp=CAU"><br>
            <small>
              <strong>{{ item.customer.firstname + ' ' + item.customer.lastname }}</strong>
            </small>
          </td>
        <td>{{item.description}}</td> 
        <td>
         <CButton class="m-2 btn--link" size="sm" color="success" @click="getFile(item.id)" >Descargar Archivo</CButton>
        </td>
      </tr>
    </paginate>
  </table>
  <paginate-links for="items" :limit="10" :show-step-links="true" :classes="{'ul': 'pagination', 'li': 'page-item', 'a': 'page-link'}"></paginate-links>

  </div>
</template>

<script>

import $ from 'jquery'
import bootstrap from 'bootstrap'
import axios from 'axios'

export default {
  name: "FileAreaTable",
  props: ["items"],
  data() {
    return {
      paginate : ['items'],
      entityTable: "notes",
      tableFields: [
        { key: "user", label: "Usuario", _classes: "text-center" },
        { key: "description", label: "Descripcion", _classes: "text-center" },
        {
          key: 'actions',
          label: 'Acciones',
          _style: { width: '1%' },
          sorter: false,
          filter: false
        }
      ],
    }
  },
  created(){
    console.log(this.items)
  },
  
 
  methods: {
    getParams(item) {
      return { customerId: item.customer_id, productId: item.id };
    },
    getQuery(item) {
      return { identifier: item.identifier, product_type: item.product_type_id };
    },
    getFile(file){
         location.href = axios.defaults.baseURL+'v1/customers/file/download/'+file
      
    },
    reset_page : function (paginate){
      for(let pag in paginate){
        paginate[pag].page = 0;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.btn--link { color: #FFF }

</style>

<style type="text/css">
.hidden{
  display:none;
}
</style>