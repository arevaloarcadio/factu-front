<template>
                        <div id="app">
                            <OrgChart :unit="organization" v-if="organization.length > 0 && users.length > 0" :users="users" :unit_id="unit_id" />
                        </div>
                    </template>

                    <script>
                    import OrgChart from './components/OrgChart.vue'
                    import axios from 'axios'

                    export default {
                      name: 'app',
                      components: {
                        OrgChart,
                      },
                      mounted(){
                        this.getUsers()
                        this.getItems()
                      },
                      data () {
                        return {
                          entity: "Organización",
                          entityTable: "organizations/1",
                          organization: [],
                          users: [],
                          unit_id: 1,
                        }
                      },
                      methods:{
                        getItems(){
                          axios({url: this.entityTable,  method: 'GET' })
                            .then(resp => {
                              const t = this
                              t.organization = resp.data
                              resolve(resp)
                            })
                            .catch(err => {
                              //commit('auth_error', err)
                              //reject(err)
                            });
                        },
                        getUsers(){
                          axios({url: "users",  method: 'GET' })
                            .then(resp => {
                              const t = this
                              t.users = resp.data
                              resolve(resp)
                            })
                            .catch(err => {
                              //commit('auth_error', err)
                              //reject(err)
                            });
                        },
                      }
                    }
                    </script>

                    <style>
                        #app {
                            font-family: 'Avenir', Helvetica, Arial, sans-serif;
                            -webkit-font-smoothing: antialiased;
                            -moz-osx-font-smoothing: grayscale;
                            text-align: center;
                            color: #2c3e50;
                            margin-top: 60px;
                        }

                        html, body {
                            width: 100%;
                            height: 100%;
                            padding: 0;
                            margin: 0;
                            overflow: hidden;
                            font-family: Helvetica;
                        }

                        #tree {
                            width: 100%;
                            height: 100%;
                        }
                    </style>