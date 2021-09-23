
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
            <strong>{{ item.user.firstname + ' ' + item.user.lastname }}</strong>
          </small>
        </td>
        <td v-html="item.note+'<br><small>'+new Date(item.created_at).toLocaleString()+'</small>'"></td>
        <td>
         <CButton class="m-2 btn--link" size="sm" color="success" @click="getFiles(item.files)" :class="{'hidden': item.files.length == 0}" >Descargar Archivo</CButton>
        </td>
      </tr>
    </paginate>
  </table>
  <paginate-links for="items" :limit="10" :show-step-links="true" :classes="{'ul': 'pagination', 'li': 'page-item', 'a': 'page-link'}"></paginate-links>
  

    <!--<CDataTable
      class="mb-0 table-outline"
      hover
      :items="items"
      :fields="tableFields"
      head-color="light"
      no-sorting
      v-if="items">

      <td slot="user" slot-scope="{ item }">
        <img width="70px" :src="'img/profiles/'+item.image"><br>
        <img width="70px" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSE985qTr1hauge-1nv0jJbyFmZL5j_R9U-Ug&usqp=CAU"><br>
        <small>
          <strong>{{ item.user.firstname + ' ' + item.user.lastname }}</strong>
        </small>
      </td>
      <td slot="actions" slot-scope="{ item }">
        <CButton class="m-2 btn--link" size="sm" color="success" @click="getFiles(item.files)" :class="{'hidden': item.files.length == 0}" >Descargar Archivo</CButton>
      </td>
    </CDataTable>-->
  </div>
</template>

<script>

import $ from 'jquery'
import bootstrap from 'bootstrap'
import axios from 'axios'

export default {
  name: "NoteTable",
  props: ["items"],
  data() {
    return {
      paginate : ['items'],
      entityTable: "notes",
      tableFields: [
        { key: "user", label: "", _classes: "text-center" },
        { key: "note", label: "Nota", _classes: "text-center" },
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
  },
  methods: {
    getParams(item) {
      return { customerId: item.customer_id, productId: item.id };
    },
    getQuery(item) {
      return { identifier: item.identifier, product_type: item.product_type_id };
    },
    getFiles(files){
      for (var i = 0; i < files.length; i++) {
         location.href = axios.defaults.baseURL+'v1/tasks/download/'+files[i].id
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