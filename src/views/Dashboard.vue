<template>
                        <div id="app">
                            <OrgChart :org="organization" v-if="organization.length > 0" />
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
                        this.getItems()
                      },
                      data () {
                        return {
                          entity: "Organización",
                          entityTable: "organizations/1",
                          organization: [],
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