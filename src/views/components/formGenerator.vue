<template>
  <div>
    <ValidationObserver v-slot="{ invalid }">
      <form @submit.prevent="send" method="POST">
        <div class="card shadow">
          <div class="card-header py-1">
            <span class="text-success"><b><slot></slot></b></span>
          </div>
          <div card="card-body">
            <div class="container-fluid">
              <div class="row pt-2"  v-for="(item, key) in items" :key="key">
                <div class="col-md-12">
                  <div class="container-fluid">
                    <div class="row">
                      <div class="col-md-12">
                        <span class="text-info"><b><u>{{ item.name }}</u></b></span>
                      </div>
                    </div>
                    <div class="row">
                        <div :class="campo.size" class="mb-2 text-success" v-for="(campo, key) in item.campos" :key="key">
                          <label :for="campo.name"  class="typo__label mb-0 text-dark">{{ campo.title }}</label>
                          <template v-if="campo.type == 'hidden'" >
                           <input 
                            type="hidden"
                            :name="campo.name"
                            :id="campo.name"
                            v-model="entity[campo.name]">
                          </template>

                          <template v-if="campo.type == 'string'" >
                            <ValidationProvider :name="campo.title" :rules="campo.validation" v-slot="{ errors, validate }">
                              <input type="text" :name="campo.name" class="form-control " v-model="entity[campo.name]" :placeholder="campo.placeholder" :id="campo.name">
                              <span class="small text-danger">{{ errors[0] }}</span>
                            </ValidationProvider>
                          </template>

                          <template v-if="campo.type == 'date'" >
                            <ValidationProvider :name="campo.title" :rules="campo.validation" v-slot="{ errors, validate }">
                              <input type="date" :name="campo.name" class="form-control"  :class="campo.clase" v-model="entity[campo.name]" :id="campo.name">
                              <span class="small text-danger">{{ errors[0] }}</span>
                            </ValidationProvider>
                          </template>

                          <template v-if="campo.type == 'number'" >
                            <ValidationProvider :name="campo.title" :rules="campo.validation" v-slot="{ errors, validate }">
                              <input 
                                type="number" 
                                class="form-control" 
                                :name="campo.name" 
                                :id="campo.name"
                                :class="campo.clase" 
                                v-model="entity[campo.name]"
                                @keyup.enter="onEnter($event, campo.name)">
                              <span class="small text-danger">{{ errors[0] }}</span>
                            </ValidationProvider>
                          </template>

                          <template v-if="campo.type == 'tel'" >
                            <ValidationProvider :name="campo.title" :rules="campo.validation" v-slot="{ errors, validate }">
                              <input type="tel" :name="campo.name" class="form-control" :class="campo.clase" v-model="entity[campo.name]" :id="campo.name">
                              <span class="small text-danger">{{ errors[0] }}</span>
                            </ValidationProvider>
                          </template>

                          <template v-if="campo.type == 'decimal'" >
                            <ValidationProvider :name="campo.title" :rules="campo.validation" v-slot="{ errors, validate }">
                              <input type="number" step="2"  :name="campo.name" class="form-control"  :class="campo.clase" v-model="entity[campo.name]" :id="campo.name">
                              <span class="small text-danger">{{ errors[0] }}</span>
                            </ValidationProvider>
                          </template>

                          <template v-if="campo.type == 'select'" >
                            <ValidationProvider :name="campo.title" :rules="campo.validation" v-slot="{ errors, validate }">
                              <select 
                                class="form-control" 
                                :name="campo.name" 
                                :id="campo.name" 
                                :class="campo.clase" 
                                v-if="campo.opciones"
                                v-model="entity[campo.name]"
                                @change="onChange($event, campo.name)">
                                <option v-for="(opcion, key) in campo.opciones" :value="opcion.id" :key="key">{{ opcion.name }}</option>
                              </select>
                              <span class="small text-danger">{{ errors[0] }}</span>
                            </ValidationProvider>
                          </template>

                          <template v-if="campo.type == 'file'" >
                            <ValidationProvider :name="campo.title" :rules="campo.validation" v-slot="{ errors, validate }">
                              <input type="file" :name="campo.name" class="form-control"  :class="campo.clase" :id="campo.name">
                              <span class="small text-danger">{{ errors[0] }}</span>
                            </ValidationProvider>
                          </template>
                          
                          <template v-if="campo.type == 'text'" >
                            <ValidationProvider :name="campo.title" :rules="campo.validation" v-slot="{ errors, validate }">
                              <textarea :name="campo.name" class="form-control"  :class="campo.clase" :id="campo.name"  v-model="entity[campo.name]" />
                              <span class="small text-danger">{{ errors[0] }}</span>
                            </ValidationProvider>
                          </template>
                        </div>
                    </div>
                  </div>
                </div>
              </div>  
            </div>
          </div>
          <div class="card-footer py-1">
            <button class="btn btn-primary  btn-sm float-right" :disabled="invalid" >Guardar</button>
          </div>
        </div>
      </form>
    </ValidationObserver>
  </div>
</template>

<script>
export default {
  name: "formGenerator",
  props: ["items", "entity"],
  mounted() {
    // console.log(this.items,"-----------<<")
  },
  data() {
    return {
      tu: "ruru"
    };
  },
  // watch: {
  //   entity: function (newEntity, oldEntity) {
  //     console.log(newEntity, oldEntity);
  //   }
  // },
  methods: {
    send(e) {
        e.preventDefault();
        this.$emit("update", true);
    },

    onChange($event, name) {
      this.$emit("change", { value: $event.target.value, name });
    },

    onEnter($event, name) {
      this.$emit("enter", { value: $event.target.value, name });
    }
  },
};
</script>

