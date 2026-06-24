# Especificações das Rotas da API

Esta API fornece recursos para gerenciamento de usuários (alunos e funcionários) e autenticação.

##  Sumário de Rotas

| Método | Rota | Descrição | Autenticação | Acesso |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/usuarios` | Cadastro de Usuário | Não | Qualquer |
| `GET` | `/api/usuarios/:id` | Visualizar informações de um usuário | Sim | Aluno (próprio/funcionários), Funcionário (todos) |
| `PATCH` | `/api/usuarios` | Atualizar dados do usuário logado | Sim| Usuário logado |
| `DELETE` | `/api/usuarios` | Soft delete na conta do usuário logado | Sim  | Usuário logado |
| `POST` | `/api/auth/login` | Autenticação de usuário  | Não | Qualquer |
| `POST` | `/api/auth/validar` | Validação de token JWT | Sim | Qualquer usuário autenticado |

---

## Gerenciamento de Usuários

### `POST /api/usuarios`

Criação de um novo usuário. O usuário deve ser obrigatoriamente do tipo aluno (`"ALUNO"`) ou funcionário (`"FUNCIONARIO"`).

#### Payload de Requisição

##### Opção A: Cadastro de Aluno
Utilize este formato quando o campo `tipo` for `"ALUNO"`.

```json
{
  "nome": "Joaquim",
  "cpf": "123.456.789-00",
  "email": "joaquim.silva@ufrrj.com",
  "celular": "(21) 99999-8888",
  "senha": "SenhaSegura123",
  "dataNascimento": "2002-05-15",
  "tipo": "ALUNO",
  "detalhesPerfil": {
    "matricula": "20260010123",
    "curso": "Sistemas de Informação",
    "nivel": "Graduação",
    "periodoIngresso": "2026.1"
  }
}
```

> **Validações de Negócio do Perfil de Aluno:**
> - `detalhesPerfil.nivel`: Deve ser obrigatoriamente um dos valores: `"Graduação"`, `"Pós-graduação"`, `"Mestrado"` ou `"Doutorado"`.

##### Opção B: Cadastro de Funcionário / Professor
Utilize este formato quando o campo `tipo` for `"FUNCIONARIO"`.

```json
{
  "nome": "Tiago Franca",
  "cpf": "348.802.940-98",
  "email": "tiago.franca@ufrrj.com",
  "celular": "11965432109",
  "senha": "SenhaClaramenteForte",
  "dataNascimento": "1975-07-14",
  "tipo": "FUNCIONARIO",
  "detalhesPerfil": {
    "siape": "3691232",
    "tipo": "Docente",
    "departamento": "Departamento de Computação",
    "instituto": "ICE",
    "membroComissao": true
  }
}
```

> **Validações de Negócio do Perfil de Funcionário:**
> - `detalhesPerfil.tipo`: Deve ser obrigatoriamente um dos valores: `"Docente"` ou `"Técnico-Administrativo"`.

#### Respostas da API

- **Status `201 Created`**
  ```json
  {
    "id": 42,
    "message": "Usuário criado com sucesso"
  }
  ```

- **Status `400 Bad Request`**
  Retornado quando o payload enviado não atende às restrições do esquema de validação. Os erros são mapeados por caminho.
  ```json
  {
    "message": "Erro de validação",
    "errors": {
      "senha": ["A senha deve ter pelo menos 6 caracteres"],
      "detalhesPerfil.matricula": ["Matrícula é obrigatória para alunos"]
    }
  }
  ```

- **Status `409 Conflict`**
  Retornado em caso de tentativa de cadastro de um dado único (E-mail, CPF, Matrícula ou SIAPE) que já está em uso por outro usuário no banco de dados.
  ```json
  {
    "message": "Erro ao criar usuário",
    "errors": {
      "general": ["Este CPF já está cadastrado."]
    }
  }
  ```

---

### `GET /api/usuarios/:id`

Lista as informações de um usuário específico.

> A requisição deve ser enviada com o token no cabeçalho: `Authorization: Bearer <token_jwt>`
>
> **Regras de Acesso:**
> - Um **aluno** apenas consegue visualizar suas próprias informações e as de funcionários.
> - Um **funcionário** tem acesso a todos os usuários.

#### Exemplo de Requisição
`GET /api/usuarios/21`

#### Respostas da API

- **Status `200 OK` (Caso seja Aluno)**
  ```json
  {
    "id": 21,
    "nome": "Joaquim",
    "cpf": "12345678900",
    "email": "joaquim.silva@ufrrj.com",
    "celular": "5521999998888",
    "dataNascimento": "2002-05-15T00:00:00.000Z",
    "matriculas": [
      {
        "id": 17,
        "matricula": "20260010123",
        "curso": "Sistemas de Informação",
        "nivel": "Graduação",
        "status": "Ativa",
        "periodoIngresso": "2026.1"
      }
    ]
  }
  ```

- **Status `200 OK` (Caso seja Funcionário)**
  ```json
  {
    "id": 22,
    "nome": "Tiago Franca",
    "cpf": "34880294098",
    "email": "tiago.franca@ufrrj.com",
    "celular": "5511965432109",
    "dataNascimento": "1975-07-14T00:00:00.000Z",
    "siape": "3691232",
    "tipo": "Docente",
    "departamento": "Departamento de Computação",
    "instituto": "ICE",
    "membroComissao": true
  }
  ```

- **Status `403 Forbidden`**
  ```json
  {
    "message": "Erro ao listar usuário",
    "errors": {
      "general": [
        "Acesso negado. Alunos só podem acessar seus próprios dados."
      ]
    }
  }
  ```

- **Status `404 Not Found`**
  ```json
  {
    "message": "Erro ao listar usuário",
    "errors": {
      "general": [
        "Usuário não encontrado"
      ]
    }
  }
  ```

---

### `PATCH /api/usuarios`

Atualiza os dados cadastrais do usuário logado.

> A requisição deve ser enviada com o token no cabeçalho: `Authorization: Bearer <token_jwt>`

#### Exemplos de Requisição

Todos os campos são opcionais. No entanto, se o objeto `detalhesPerfil` for enviado para alunos, é obrigatório passar o `matriculaId`.

##### Exemplo Aluno
```json
{
  "email": "joaquim.novoemail@ufrrj.br",
  "celular": "5521988887777",
  "detalhesPerfil": {
    "matriculaId": 17,
    "status": "Trancado"
  }
}
```

##### Exemplo Funcionário
```json
{
  "email": "tiago.franca@ufrrj.com",
  "celular": "5511965432109",
  "detalhesPerfil": {
    "departamento": "Departamento de Computação",
    "instituto": "ICE",
    "membroComissao": true
  }
}
```

#### Respostas da API
- **Status `204 No Content`**: Atualização realizada com sucesso.

---

### `DELETE /api/usuarios`

Realiza a exclusão lógica (soft delete) da conta do usuário autenticado.

> A requisição deve ser enviada com o token no cabeçalho: `Authorization: Bearer <token_jwt>`

#### Respostas da API
- **Status `204 No Content`**: Conta desativada com sucesso.

---

## Autenticação

### `POST /api/auth/login`

Realiza a autenticação de um usuário no sistema e gera um token JWT.

#### Exemplo de Requisição
```json
{
  "email": "joaquim.silva@ufrrj.com",
  "senha": "SenhaSegura123"
}
```

#### Respostas da API

- **Status `200 OK`**
  ```json
  {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c3VhcmlvSWQiOjIxLCJlbWFpbCI6ImpvYXF1aW0uc2lsdmFAdWZycmouY29tIiwicGFwZWwiOiJBbHVubyIsImlhdCI6MTc4MjI2ODcyNSwiZXhwIjoxNzgyMjY4Nzg1fQ.v7LJ-DMpUTspOqIsVDb62GRxWHCDzVxltH9ZweBRRv4"
  }
  ```
  > [!NOTE]
  > O payload decodificado do JWT contém: `usuarioId`, `email`, `papel` e `exp`.  
  > O campo `papel` pode assumir um dos seguintes valores: `Aluno`, `Funcionário` ou `Membro da comissão`.

- **Status `401 Unauthorized`**
  ```json
  {
    "message": "Erro ao autenticar usuário",
    "errors": {
      "general": [
        "Credenciais inválidas"
      ]
    }
  }
  ```

---

### `POST /api/auth/validar`

Verifica se o token JWT enviado é válido e não expirou.

> A requisição deve ser enviada com o token no cabeçalho: `Authorization: Bearer <token_jwt>`

#### Respostas da API

- **Status `200 OK`**
  ```json
  {
    "message": "Token válido"
  }
  ```

- **Status `401 Unauthorized`**
  ```json
  {
    "error": "Acesso negado. Token de autenticação não fornecido."
  }
  ```

- **Status `403 Forbidden`**
  ```json
  {
    "error": "Token inválido ou expirado."
  }
  ```