const items = {
  information: [
    {
      name: "Identificación",
      campos: [
        {
          name: "firstname",
          title: "Nombre",
          placeholder: "Introduzca Nombre",
          validation: "required|min:3",
          type: "string",
          size: "col-md-6",
        },
        {
          name: "lastname",
          title: "Apellidos",
          placeholder: "Introduzca Apellidos",
          validation: "required|min:3",
          type: "string",
          size: "col-md-6 col-md-offset-right-4",
        },
        {
          name: "email",
          title: "Email",
          placeholder: "Introduzca Email",
          validation: "required|email",
          type: "string",
          size: "col-md-12 col-md-offset-right-4",
        },
      ],
    }
  ],
  security: [
    {
      name: "Cambia tu contraseña",
      campos: [
        {
          name: "password",
          title: "Nueva contraseña",
          placeholder: "Introduzca Contraseña",
          type: "string",
          size: "col-md-6",
        },
        {
          name: "password_confirmation",
          title: "Confirmar nueva contraseña",
          placeholder: "Repita su contraseña",
          type: "string",
          size: "col-md-6 col-md-offset-right-4",
        },
      ],
    }
  ]
}

export default items;
