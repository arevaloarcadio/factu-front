
<template>
  <div>
    <CDataTable
      class="mb-0 table-outline"
      hover
      :items="items"
      :fields="tableFields"
      head-color="light"
      no-sorting
      v-if="items">

      <!-- <td slot="actions" slot-scope="{ item }">
        <router-link :to="{ name: 'products.edit', params: getParams(item), query: getQuery(item) }">
          <CButton class="m-2 btn--link" size="sm" color="warning">Editar</CButton>
        </router-link>
      </td> -->
    </CDataTable>
  </div>
</template>

<script>

export default {
  name: "NoteTable",
  props: ["items"],
  data() {
    return {
      entityTable: "products",
      tableFields: [
        { key: "description", label: "Descripción", _classes: "text-center" }
        ]
    }
  },
  methods: {
    getParams(item) {
      return { customerId: item.customer_id, productId: item.id };
    },
    getQuery(item) {
      return { identifier: item.identifier, product_type: item.product_type_id };
    }
  }
};
</script>

<style lang="scss" scoped>
.btn--link { color: #FFF }
</style>