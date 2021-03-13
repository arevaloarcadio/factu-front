
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
      <td slot="admin" slot-scope="{ item }" class="text-center">
        <CIcon
          name="cil-check"
          style="color: green"
          height="25"
          v-show="item.admin"/>
      </td>
      <td slot="actions" slot-scope="{ item }">
        <router-link
          :to="'/' + entityTable + '/' + item.id"
          :disabled="true">
          Editar
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
      ],
    };
  }
};
</script>