<template>
	<div>
		<div id="editForm" style="display:none; text-align:center; position:absolute; border: 1px solid #aeaeae;width:300px;z-index:10000; background-color: #eeeeee">
	        <div style="padding: 10px 0 10px 0; background-color:#039BE5; color: #ffffff;">Agregar Subordinado</div>
			    <div>
			    	<multiselect name="user_id" v-model="user_id" :options="users" :searchable="true" track-by="firstname" :custom-label="completeName">
			    		<template slot="singleLabel" slot-scope="{ option }"><strong>{{ option.firstname }}   {{ option.lastname }}</strong></template>
			    	</multiselect>

			        <div style="padding: 5px 0 15px 0;">
			            <button class="btn btn-danger mr-2" id="cancel">Cancelar</button>
			            <button class="btn btn-success" id="save" @click="storeUser">Guardar</button>
			        </div>
			    </div>
			</div>
		<div id="tree" ref="tree" :key="unit_id"></div>	
	</div>
	    
</template>

<script>

import OrgChart from '@balkangraph/orgchart.js'
import Multiselect from 'vue-multiselect'
import axios from 'axios'
import { mapGetters } from 'vuex'

export default {

	name: 'tree',
	props: ['unit', 'users','unit_id'],
	data() {
		return {
	        chart: null,
	        org: null,
	        editForm: null,
	        user_id: null,
	        user: {
	        	parent_id: 0,
	        	above_id: 0,
	        	user_id: 0,
	        	level: 0,
	        	unit_id: 0,
	        }
	    }
	},

	methods: {
		completeName ({ firstname, lastname }) {
	    	return `${firstname} ${lastname}`
	    },

	    oc: function(domEl, x) {
	        this.chart = new OrgChart(
	        	domEl, {
	                    nodes: x,
	                    nodeBinding: {
	                        field_0: "name", img_0: "img",
	                    },
	                    template: 'polina',
	                    editUI: new this.editForm,
	        });
	    },

	    storeUser(){
	    	var node = this.chart.get(this.chart.editUI.nodeId)
	    	this.user.parent_id = node.id
	    	this.user.above_id = node.user_id
	    	this.user.user_id = this.user_id.id
	    	this.user.level = node.level + 1
	    	this.user.unit_id = this.unit_id


	    	axios({url: 'organizations',  method: 'POST', data: this.user })
                .then(resp => {
               		this.getOrganization()
                	
                    resolve(resp)

                })
                .catch(err => {
                	//commit('auth_error', err)
                    //reject(err)
                });
	    },

	    getOrganization(){
	    	axios({url: 'organizations/'+this.unit_id, method: 'GET'})
	    		.then(resp => {
	    			this.org = resp.data
   					this.oc(this.$refs.tree, this.organization)

	    		})
	    },       
	},

	mounted(){
		this.org = this.unit
		this.editForm = function () {
            this.nodeId = null;
        };
        var self = this
        this.editForm.prototype.init = function (obj) {
            var that = this;
            this.obj = obj;

            this.editForm = document.getElementById("editForm");
            this.saveButton = document.getElementById("save");
            this.cancelButton = document.getElementById("cancel");

            this.cancelButton.addEventListener("click", function () {
                that.hide();
            });

            this.saveButton.addEventListener("click", function () {
                that.hide();
            });
        };

        this.editForm.prototype.show = function (nodeId) {
        	if(self.getUser.admin){
        	var that = this
        		this.hide();
        	that.nodeId = nodeId

            var left = document.body.offsetWidth / 2 - 150;
            this.editForm.style.display = "block";
            this.editForm.style.left = left + "px";
            }
        };

        this.editForm.prototype.hide = function (showldUpdateTheNode) {
            this.editForm.style.display = "none";
        };

		this.oc(this.$refs.tree, this.organization)
	},
	computed:{
		organization: function(){
			
			this.org.forEach( function(data) {
			  data['name'] = data["user"]['firstname'] + " " + data["user"]['lastname'];
			  data['pid'] = data['parent_id'];
				if(data["id"] == data["pid"]){
					delete data.pid;
				}

			});
			return this.org
		},
    	 ...mapGetters([
        'getUser'
	    ]),
	}
}
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<style scoped>
</style>