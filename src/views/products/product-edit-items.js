const items = [
  {
    name: "Información",
    campos: [
      {
        name: "product_type_id",
        title: "Tipo",
        placeholder: "Introduzca Móvil",
        validation: "required",
        type: "select",
        size: "col-md-6 col-md-offset-right-4",
        opciones: [],
      },
      {
        name: "identifier",
        title: "Identificador",
        placeholder: "0039293029302",
        validation: "required",
        type: "string",
        size: "col-md-6 col-md-offset-right-4",
      },
      {
        name: "price",
        title: "Precio de Producto",
        placeholder: "Ingrese el  precio",
        validation: "",
        type: "decimal",
        size: "col-md-6 col-md-offset-right-4",
      },
       {
        name: "status",
        title: "Estado",
        placeholder: "Introduzca el Estado",
        validation: "required",
        type: "select",
        size: "col-md-6 col-md-offset-right-4",
        opciones : [ 
              {
                id:'Activo',
                name: 'Activo'
              },
              {
                id:'No Activo',
                name: 'No Activo'
              },
              {
                id:'Anulado',
                name: 'Anulado'
              },
              {
                id:'En Vigor',
                name: 'En Vigor'
              },
              {
                id:'En Riesgo',
                name: 'En Riesgo'
              },
              {
                id:'Finalizado',
                name: 'Finalizado'
              }
            ]
          },
    ],
  }
]

export default items;
