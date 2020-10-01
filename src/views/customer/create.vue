<template>
	<div>
		<formGenerator :items="itemsForm" :entity="entityForm" @update="updated()">Crear Cliente
		</formGenerator>
	</div>
</template>

<script>
import VueNotifications from "vue-notifications"
import formGenerator from "@/components/formGenerator.vue"

export default {
	name: 'Companies',
	components:{ formGenerator},
	data () {
		return {
			entity: "Clientes",
			newEntity: "Nuevo Cliente",
			itemsForm:[
				{ 
					name: 'Identificación', 
					campos:[
						{ name: 'office', title: 'Oficina', placeholder:'Introduzca Oficina', validation: "", type: 'string', size:"col-md-4" },
						{ name: 'name', title: 'Nombre', placeholder:'Introduzca Nombre', validation: "required|min:3", type: 'string', size:"col-md-4" },
						{ name: 'cif', title: 'NIF/CIF', placeholder:'Introduzca documento', validation: "required|min:6", type: 'string', size:"col-md-4" },
						{ name: 'address', title: 'Dirección', placeholder:'Introduzca Dirección', validation: 'required' , type: 'string', size:"col-md-8 col-md-offset-right-4"},
						{ name: 'city', title: 'Ciudad', validation: 'required', type: 'string', size:"col-md-4" },
						{ name: 'pc', title: 'Código Postal', validation: 'required', type: 'string', size:"col-md-4" },
						{ name: 'province', title: 'Provincia', validation: 'required', type: 'string', size:"col-md-4" },
					]
				},
				{ 
					name: 'Comunicación', 
					campos:[
						{ name: 'phone', title: 'Teléfono', placeholder:'Introduzca Teléfono', validation: 'required', type: 'number', size:"col-md-4" },
						{ name: 'email', title: 'Documento', placeholder:'Introduzca Email', validation: 'required|email', type: 'string', size:"col-md-4 col-md-offset-right-4" },
					]
				},
				{ 
					name: 'Información adicional', 
					campos:[
						{ name: 'description', title: 'Descripción', placeholder:'Introduzca Descripción', validation: '', type: 'text', size:"col-md-4" },
					]
				},
				
			],
			entityForm:{
	            office: '',
	            name: '',
	            cif: '',
	            address: '',
	            city: '',
	            pc: '',
	            province: '',
	            phone: '',
	            email: '',
	            description: '',
            },
		}
	},
	created(){
		
	},
	methods:{
		updated(){
			self = this
			this.$http({url: 'customer' , method: 'POST',data: this.entityForm })
	        .then(response => {
	          if(response.status == "200"){
	          	self.showSuccessMsg()
	            self.$router.push({path: '/customer'});

	          }
	        })
	        .catch(err => {
	          //commit('auth_error', err)
	          //self.unsetUser('token')
	          //reject(err)
	        });

		}
	},
	notifications: {
		showSuccessMsg: {
			type: VueNotifications.types.success,
			title: 'Operación completada',
			message: 'Registro añadido con éxito!'
		},
		showErrorMsg: {
			type: VueNotifications.types.error,
			title: 'Operación rechazada',
			message: 'Algo salió mal'
		}
	}
}
</script>

