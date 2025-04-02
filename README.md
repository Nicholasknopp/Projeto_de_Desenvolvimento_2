# Sistema de Gestão de Medicamentos

Um sistema web para gerenciamento de estoque de medicamentos, desenvolvido com React, Node.js e Prisma.

## Funcionalidades

- Cadastro e gerenciamento de medicamentos
- Controle de estoque
- Rastreamento de lotes
- Histórico de movimentações
- Notificações de validade
- Geração de relatórios

## Tecnologias Utilizadas

- Frontend: React, TypeScript, Mantine UI
- Backend: Node.js, Express
- Banco de Dados: PostgreSQL com Prisma ORM

## Instalação

1. Clone o repositório:
```bash
git clone [URL_DO_REPOSITÓRIO]
cd sistema-gestao-medicamentos
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
Crie um arquivo `.env` na raiz do projeto e configure as variáveis necessárias:
```env
DATABASE_URL="postgresql://seu_usuario:sua_senha@localhost:5432/nome_do_banco"
```

4. Execute as migrações do banco de dados:
```bash
npx prisma migrate dev
```

5. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

## Uso

Acesse o sistema através do navegador em `http://localhost:3000`

## Contribuição

1. Faça um Fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.