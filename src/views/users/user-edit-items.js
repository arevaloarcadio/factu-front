const items = {
  information: [
    {
      name: "Identificación",
      campos: [
        {
          name: "name",
          title: "Nombre",
          placeholder: "Introduzca Nombre",
          validation: "required|min:3",
          type: "string",
          size: "col-md-4",
        },
        {
          name: "last_name",
          title: "Apellidos",
          placeholder: "Introduzca Apellidos",
          validation: "required|min:3",
          type: "string",
          size: "col-md-4 col-md-offset-right-4",
        },
        {
          name: "user_name",
          title: "Nombre de Usuario",
          placeholder: "Introduzca nombre de usuario",
          validation: "required|min:3",
          type: "string",
          size: "col-md-4",
        },
        {
          name: "email",
          title: "Email",
          placeholder: "Introduzca Email",
          validation: "required|email",
          type: "string",
          size: "col-md-4 col-md-offset-right-4",
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
          type: "password",
          size: "col-md-6",
        },
        {
          name: "password_confirmation",
          title: "Confirmar nueva contraseña",
          placeholder: "Repita su contraseña",
          type: "password",
          size: "col-md-6 col-md-offset-right-4",
        },
      ],
    }
  ]
}

export default items;
