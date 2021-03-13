
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
    </CDataTable>
  </div>
</template>

<script>

export default {
  name: "ProductTable",
  props: ["items"],
  data() {
    return {
      entityTable: "products",
      tableFields: [
        { key: "customer",      label: "Cliente" },
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