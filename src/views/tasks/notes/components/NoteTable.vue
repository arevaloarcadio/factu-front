
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

      <td slot="user" slot-scope="{ item }">
        <img width="70px" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSE985qTr1hauge-1nv0jJbyFmZL5j_R9U-Ug&usqp=CAU"><br>
        <small>
          <strong>{{ item.firstname + ' ' + item.lastname }}</strong>
        </small>
      </td>
    </CDataTable>
  </div>
</template>

<script>

export default {
  name: "NoteTable",
  props: ["items"],
  data() {
    return {
      entityTable: "notes",
      tableFields: [
        { key: "user", label: "", _classes: "text-center" },
        { key: "note", label: "Nota", _classes: "text-center" }
      ]
    }
  },
  created(){
    console.log(this.items,"<-----")
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