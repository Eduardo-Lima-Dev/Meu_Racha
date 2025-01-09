
# ⚽ Meu Racha

**Meu Racha** é um sistema web desenvolvido com Next.js e TypeScript, utilizando o Firebase para gerenciamento de dados e autenticação. O objetivo principal é facilitar o nivelamento dos jogadores de um racha de futebol, permitindo que todos os participantes avaliem uns aos outros em uma escala de 1 a 5 estrelas. Essas avaliações ocorrem em períodos específicos, controlados pelos administradores (ADMs) da plataforma.

## 🚀 Funcionalidades

- **Criação e Login de Usuários**: Permite que novos usuários se cadastrem e façam login no sistema.
- **Votação de Nível de Jogadores**: Os jogadores podem avaliar o nível dos colegas durante os períodos de votação liberados pelos ADMs.
- **Adição de Jogadores**: Possibilidade de adicionar novos jogadores ao sistema.
- **Registro e Atualização de Gols e Assistências**: Funcionalidade para registrar e atualizar o número de gols e assistências de cada jogador.
- **Limpeza de Dados**: Opção para zerar todo o banco de dados, disponível apenas para ADMs.
- **Limpeza de Estrelas**: Possibilidade de resetar as avaliações de estrelas dos jogadores.
- **Visualização de Gráficos**: Gráficos para visualizar estatísticas e desempenho dos jogadores ao longo do tempo.

## 🔒 Regras de Votação

- Um usuário não pode votar mais de uma vez no mesmo período de votação.
- É obrigatório votar em todos os jogadores; não é permitido votar apenas em alguns.
- Somente usuários logados podem participar das votações.
- As votações só podem ocorrer durante os períodos liberados pelos ADMs.

## 🛠️ Tecnologias Utilizadas

- **Next.js**: Framework React para desenvolvimento de aplicações web com renderização do lado do servidor.
- **TypeScript**: Superset do JavaScript que adiciona tipagem estática ao código.
- **Firebase**: Plataforma do Google que oferece serviços como autenticação, banco de dados em tempo real e hospedagem.

## 📂 Estrutura de Pastas

A estrutura de pastas do projeto é organizada da seguinte forma:

```
meu-racha/
├── public/
├── src/
│   ├── app/
│   │   ├── admin/
│   │   ├── dashboard/
│   │   ├── fonts/
|   |   ├── graficos/
│   │   ├── home/
│   │   ├── login/
│   │   └── votos/
│   │   |    └── auth_votos
│   │   |      └── modal.tsx
|   |   |     
│   ├── components/
│   ├── config/
│   ├── hooks/
│   └── lib/
├── .env.local
├── .gitignore
├── firebase.json
├── next.config.js
├── package.json
├── README.md
└── tsconfig.json
```

## 📝 Pré-requisitos

- **Node.js**: Certifique-se de ter o Node.js instalado na versão 18.18 ou superior.
- **Firebase CLI**: Instale a Firebase CLI para gerenciar os serviços do Firebase.

## ⚙️ Instalação e Execução

Siga os passos abaixo para configurar e executar o projeto localmente:

1. **Clonar o Repositório**:

   ```bash
   git clone https://github.com/Luiz-Eduardo-BL/Meu_Racha.git
   cd meu-racha
   ```

2. **Instalar Dependências**:

   Utilize o npm para instalar as dependências do projeto:

   ```bash
   yarn install
   ```

3. **Configurar Variáveis de Ambiente**:

   Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=sua_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=seu_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=seu_app_id
   ```

   Substitua os valores acima pelas credenciais do seu projeto no Firebase.

4. **Executar o Projeto**:

   Inicie o servidor de desenvolvimento:

   ```bash
   yarn dev
   ```

   O projeto estará disponível em `http://localhost:3000`.

## 🤝 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests no repositório oficial.
