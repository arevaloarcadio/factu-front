const items = [
  {
    "name": "Identificación",
    "campos": [
      {
        "name": "cif",
        "title": "DNI",
        "placeholder": "Introduzca DNI",
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
        "validation": "",
        "type": "date",
        "size": "col-md-4"
      }
    ]
  },
  // {
  //   "name": "Dirección",
  //   "campos": [
  //     {
  //       "name": "country",
  //       "title": "País/Región",
  //       "placeholder": "País/Región",
  //       "type": "select",
  //       "size": "col-md-4",
  //       "opciones": []
  //     },
  //     {
  //       "name": "province",
  //       "title": "Provincia",
  //       "placeholder": "Provincia",
  //       "type": "select",
  //       "size": "col-md-4",
  //       "opciones": []
  //     },
  //     {
  //       "name": "city",
  //       "title": "Ciudad",
  //       "placeholder": "Ciudad",
  //       "type": "select",
  //       "size": "col-md-4",
  //       "opciones": []
  //     },
  //     {
  //       "name": "address",
  //       "title": "Dirección",
  //       "placeholder": "Dirección",
  //       "validation": "required|min:3",
  //       "type": "string",
  //       "size": "col-md-8"
  //     },
  //     {
  //       "name": "zip-code",
  //       "title": "Código Postal",
  //       "placeholder": "Código Postal",
  //       "type": "select",
  //       "size": "col-md-4",
  //       "opciones": []
  //     },
  //   ]
  // },
  {
    "name": "Comunicación",
    "campos": [
      {
        "name": "phone",
        "title": "Teléfono",
        "placeholder": "Introduzca Teléfono",
        "validation": 'required_if:cellphone,null|numeric',
        "type": "number",
        "size": "col-md-4"
      },
      {
        "name": "cellphone",
        "title": "Móvil",
        "placeholder": "Introduzca Móvil",
        "validation": 'required_if:phone,null|numeric',
        "type": "number",
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
          "name": "revision_time",
          "title": "Tiempo de revisión",
          "placeholder": "Introduzca el tiempo de revisión",
          "validation": "required",
          "type": "number",
          "size": "col-md-4"
      }, 
    ]
  }
]

export default items;
