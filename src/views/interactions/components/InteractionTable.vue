
<template>
  <div>

    <table class="table table-responsive-sm table-striped">
           <thead >
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
              <td>{{item.type}}</td> 
              <td>{{item.description }}</td> 
              <td>{{new Date(item.created_at).toLocaleString()  }}</td> 
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
  name: "InteractionTable",
  props: ["items"],
  data() {
    return {
      paginate : ['items'],
      entityTable: "products",
      tableFields: [
        { key: "type",        label: "Tipo",        _classes: "text-center" },
        { key: "description", label: "Descripción", _classes: "text-center" },
        { key: "description", label: "Fecha", _classes: "text-center" },
        // {
        //   key: 'actions',
        //   label: 'Acciones',
        //   _style: { width: '1%' },
        //   sorter: false,
        //   filter: false
        // },
      ],
    };
  },
  updated(){
     this.reset_page(this.paginate)
  },
  methods: {
    getParams(item) {
      return { customerId: item.customer_id, productId: item.id };
    },
    getQuery(item) {
      return { identifier: item.identifier, product_type: item.product_type_id };
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