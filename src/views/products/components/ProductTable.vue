
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
    <paginate name="items" :list="items" :per="3" tag="tbody">
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
        <td>{{item.identifier }}</td>
        <router-link :to="{ name: 'products.edit', params: getParams(item), query: getQuery(item) }">
          <CButton class="m-2 btn--link" size="sm" color="warning">Editar</CButton>
        </router-link>
      </tr>
    </paginate>
  </table>
  <paginate-links for="items" :limit="3" :show-step-links="true" :classes="{'ul': 'pagination', 'li': 'page-item', 'a': 'page-link'}"></paginate-links>
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

export default {
  name: "ProductTable",
  props: ["items"],
  data() {
    return {
      paginate : ['items'],
      entityTable: "products",
      filter : 'Activo',
      tableFields: [
        { key: "product_types", label: "Tipo",          _classes: "text-center" },
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