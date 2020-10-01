<template>
  <div>
    <ValidationObserver v-slot="{ invalid }">
      <form @submit.prevent="send" method="POST">
        <div class="card">
          <div class="card-header">
            <span class="text-success"><b><slot></slot></b></span>
          </div>
          <div card="card-body">
            <div class="container-fluid">
              <div class="row pt-4"  v-for="item in items">
                <div class="col-md-12">
                  <div class="container-fluid">
                    <div class="row">
                      <div class="col-md-12">
                        <span class="text-info"><b><u>{{ item.name }}</u></b></span>
                      </div>
                    </div>
                    <div class="row">
                        <div v-for="campo in item.campos"  :class="campo.size" class="mb-3">
                          <template v-if="campo.type == 'string'" >
                            <label :for="campo.name"  class="typo__label">{{ campo.title }}</label>
                            <ValidationProvider :name="campo.title" :rules="campo.validation" v-slot="{ errors, validate }">
                              <input type="text" :name="campo.name" class="form-control" v-model="entity[campo.name]" :placeholder="campo.placeholder" :id="campo.name">
                              <span class="small text-danger">{{ errors[0] }}</span>
                            </ValidationProvider>
                          </template>
                          <template v-if="campo.type == 'date'" >
                            <label :for="campo.name"  class="typo__label">{{ campo.title }}</label>
                            <ValidationProvider :name="campo.title" :rules="campo.validation" v-slot="{ errors, validate }">
                              <input type="date" :name="campo.name" class="form-control"  :class="campo.clase" v-model="entity[campo.name]" :id="campo.name">
                              <span class="small text-danger">{{ errors[0] }}</span>
                            </ValidationProvider>
                          </template>
                          <template v-if="campo.type == 'number'" >
                            <label :for="campo.name"  class="typo__label">{{ campo.title }}</label>
                            <ValidationProvider :name="campo.title" :rules="campo.validation" v-slot="{ errors, validate }">
                              <input type="number" :name="campo.name" class="form-control"  :class="campo.clase" v-model="entity[campo.name]" :id="campo.name">
                              <span class="small text-danger">{{ errors[0] }}</span>
                            </ValidationProvider>
                          </template>
                          <template v-if="campo.type == 'decimal'" >
                            <label :for="campo.name"  class="typo__label">{{ campo.title }}</label>
                            <ValidationProvider :name="campo.title" :rules="campo.validation" v-slot="{ errors, validate }">
                              <input type="number"  step="2"  :name="campo.name" class="form-control"  :class="campo.clase" v-model="entity[campo.name]" :id="campo.name">
                              <span class="small text-danger">{{ errors[0] }}</span>
                            </ValidationProvider>
                          </template>
                          <template v-if="campo.type == 'select'" >
                            <label :for="campo.name"  class="typo__label">{{ campo.title }}</label>
                            <ValidationProvider :name="campo.title" :rules="campo.validation" v-slot="{ errors, validate }">
                              <select :name="campo.name" class="form-control"  :class="campo.clase" v-model="entity[campo.name]" :id="campo.name" v-if="campo.opciones">
                                <option v-for="opcion in campo.opciones" :value="opcion.id">{{ opcion.name }}</option>
                              </select>
                              <span class="small text-danger">{{ errors[0] }}</span>
                            </ValidationProvider>
                          </template>
                          <template v-if="campo.type == 'file'" >
                            <label :for="campo.name"  class="typo__label">{{ campo.title }}</label>
                            <ValidationProvider :name="campo.title" :rules="campo.validation" v-slot="{ errors, validate }">
                              <input type="file" :name="campo.name" class="form-control"  :class="campo.clase" :id="campo.name">
                              <span class="small text-danger">{{ errors[0] }}</span>
                            </ValidationProvider>
                          </template>
                          <template v-if="campo.type == 'text'" >
                            <label :for="campo.name"  class="typo__label">{{ campo.title }}</label>
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
          <div class="card-footer">
            <button class="btn btn-primary float-right" :disabled="invalid" >Guardar</button>
          </div>
        </div>
      </form>
    </ValidationObserver>
  </div>
</template>

<script>

export default {
  name: 'formGenerator',
        props:['items','entity'],
        mounted() {
        },
        data () {
          return {
            
          }
        },
        methods:{
          send(e){
            this.$emit('update',true)
            e.preventDefault()
          },
        }
}
</script>
