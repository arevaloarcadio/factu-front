const itemsOLD = [
  {
    "name": "Identificación",
    "campos": [
      {
        "name": "firstname",
        "title": "Nombre",
        "placeholder": "Introduzca Nombre",
        "validation": "required|min:3",
        "type": "string",
        "size": "col-md-4"
      },
      {
        "name": "lastname",
        "title": "Apellidos",
        "placeholder": "Introduzca Apellidos",
        "validation": "required|min:3",
        "type": "string",
        "size": "col-md-4"
      },
      {
        "name": "cif",
        "title": "DNI",
        "validation": "required",
        "type": "string",
        "size": "col-md-4"
      },
      {
        "name": "birthdate",
        "title": "Fecha Nacimiento",
        "validation": "required",
        "type": "date",
        "size": "col-md-4"
      }
    ]
  },
  {
    "name": "Comunicación",
    "campos": [
      {
        "name": "phone",
        "title": "Teléfono",
        "placeholder": "Introduzca Teléfono",
        "validation": "required",
        "type": "number",
        "size": "col-md-4"
      },
      {
        "name": "cellphone",
        "title": "Móvil",
        "placeholder": "Introduzca Móvil",
        "validation": "required",
        "type": "number",
        "size": "col-md-4 col-md-offset-right-4"
      },
      {
        "name": "email",
        "title": "Email",
        "placeholder": "Introduzca Email",
        "validation": "required|email",
        "type": "string",
        "size": "col-md-4 col-md-offset-right-4"
      }
    ]
  },
  {
    "name": "Información adicional",
    "campos": [
      {
        "name": "description",
        "title": "Descripción",
        "placeholder": "Introduzca Descripción",
        "validation": "",
        "type": "text",
        "size": "col-md-4"
      }
    ]
  },
  {
    "name": "Direcciones",
    "campos": [
      {
        "name": "country",
        "title": "País/Región",
        "placeholder": "País/Región",
        "type": "select",
        "size": "col-md-4",
        "opciones": []
      },
      {
        "name": "province",
        "title": "Provincia",
        "placeholder": "Provincia",
        "type": "select",
        "size": "col-md-4",
        "opciones": []
      },
      {
        "name": "city",
        "title": "Ciudad",
        "placeholder": "Ciudad",
        "type": "select",
        "size": "col-md-4",
        "opciones": []
      },
      {
        "name": "address",
        "title": "Dirección",
        "placeholder": "Dirección",
        "validation": "required|min:3",
        "type": "string",
        "size": "col-md-8"
      },
      {
        "name": "zip-code",
        "title": "Código Postal",
        "placeholder": "Código Postal",
        "type": "select",
        "size": "col-md-4",
        "opciones": []
      },
    ]
  }
]

const items = {
  information: [
    {
      "name": "Identificación",
      "campos": [
       {  
          "name": "cif",
          "title": "DNI",
          "validation": "",
          "type": "string",
          "size": "col-md-4"
        },
        {
          "name": "firstname",
          "title": "Nombre",
          "placeholder": "Introduzca Nombre",
          "validation": "required|min:3",
          "type": "string",
          "size": "col-md-4"
        },
        {
          "name": "lastname",
          "title": "Apellidos",
          "placeholder": "Introduzca Apellidos",
          "validation": "required|min:3",
          "type": "string",
          "size": "col-md-4"
        },
        
        {
          "name": "birthdate",
          "title": "Fecha Nacimiento",
          "validation": "required",
          "type": "date",
          "size": "col-md-4"
        }
      ]
    },
    {
      "name": "Comunicación",
      "campos": [
        {
          "name": "phone",
          "title": "Teléfono",
          "placeholder": "Introduzca Teléfono",
          "validation": "required",
          "type": "tel",
          "size": "col-md-4"
        },
        {
          "name": "cellphone",
          "title": "Móvil",
          "placeholder": "Introduzca Móvil",
          "validation": "required",
          "type": "tel",
          "size": "col-md-4 col-md-offset-right-4"
        },
        {
          "name": "email",
          "title": "Email",
          "placeholder": "Introduzca Email",
          "validation": "email",
          "type": "string",
          "size": "col-md-4 col-md-offset-right-4"
        }
      ]
    },
    {
      "name": "Información adicional",
      "campos": [
        {
          "name": "description",
          "title": "Descripción",
          "placeholder": "Introduzca Descripción",
          "validation": "",
          "type": "text",
          "size": "col-md-4"
        },  
         {
          "name": "status",
          "title": "Estado",
          "placeholder": "Estado",
          "type": "select",
          "size": "col-md-4",
          "opciones": [
            {
              id : 'Activo',
              name : 'Activo'
            },
            {
              id : 'Inactivo',
              name : 'Inactivo'
            }
          ]
        },
        {
          "name": "revision_time",
          "title": "Tiempo de revisión",
          "placeholder": "Introduzca el tiempo de revisión",
          "validation": "required",
          "type": "number",
          "size": "col-md-4"
        },  
      ]
    },
  ],
  informationCollapse: [
    {
      "name": "Identificación",
      "campos": [
      {
          "name": "cifCollapse",
          "title": "DNI",
          "placeholder": "",
          "validation": "",
          "type": "string",
          "size": "col-md-3",
          "disabled" : true
        },
        {
          "name": "firstnameCollapse",
          "title": "Nombre",
          "placeholder": "Introduzca Nombre",
          "validation": "required|min:3",
          "type": "string",
          "size": "col-md-3"
        },
        {
          "name": "lastnameCollapse",
          "title": "Apellidos",
          "placeholder": "Introduzca Apellidos",
          "validation": "required|min:3",
          "type": "string",
          "size": "col-md-3"
        },
        {
        "name": "birthdateCollapse",
        "title": "Fecha Nacimiento",
        "validation": "",
        "type": "date",
        "size": "col-md-3"
      }
      ]
    },
  ],
  addresses: [
    {
      "name": "Dirección",
      "campos": [
        {
          "name": "id",
          "type": "hidden"
        },
        {
          "name": "country",
          "title": "País/Región",
          "placeholder": "País/Región",
          "type": "select",
          "size": "col-md-4",
          "opciones": []
        },
        {
          "name": "province",
          "title": "Provincia",
          "placeholder": "Provincia",
          "type": "select",
          "size": "col-md-4",
          "opciones": []
        },
        {
          "name": "city",
          "title": "Ciudad",
          "placeholder": "Ciudad",
          "type": "select",
          "size": "col-md-4",
          "opciones": []
        },
        {
          "name": "address",
          "title": "Dirección",
          "placeholder": "Dirección",
          "validation": "required|min:3",
          "type": "string",
          "size": "col-md-8"
        },
        {
          "name": "zipCode",
          "title": "Código Postal",
          "placeholder": "Código Postal",
          "type": "select",
          "size": "col-md-4",
          "opciones": []
        },
      ]
    }
  ]
}

export default items;
