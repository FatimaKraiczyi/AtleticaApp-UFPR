# AtleticaApp-UFPR

Este é o repositório do projeto **AtleticaApp-UFPR**, desenvolvido como parte do Trabalho de Conclusão de Curso (TCC) na Universidade Federal do Paraná (UFPR). O objetivo do projeto é facilitar a gestão e interação das atléticas universitárias com os alunos da instituição, proporcionando uma plataforma eficiente e intuitiva.


## 📝 Para Currículo

**Atlética UFPR — Aplicação Web (TCC)**

Desenvolvimento do front-end de aplicação web destinada a melhorar a gestão das atléticas universitárias na Universidade Federal do Paraná (UFPR)

●	**Interface moderna e responsiva** construída com Next.js (React), TypeScript, Tailwind CSS e Gluestack UI, com foco em experiência do usuário e design adaptável para múltiplos dispositivos

●	**Integração completa com API back-end**, incluindo sistema de autenticação de usuários (login, cadastro, recuperação de senha), gerenciamento de pedidos, produtos, membros, eventos e assinaturas

●	**Implementação de fluxos de pagamento online** com integração de gateway de pagamento para processamento seguro de transações

●	**Deploy do front-end realizado na Vercel**, garantindo alta disponibilidade e performance da aplicação


## 🚀 Começando

Siga as instruções abaixo para configurar e executar o projeto localmente.


### 📥 Instalação

1. **Clone o repositório:**

```bash
git clone https://github.com/FatimaKraiczyi/AtleticaApp-UFPR.git

```

2. **Acesse o diretório do projeto:**

```bash
cd AtleticaApp-UFPR
cd next
```

3. **Instale as dependências:**

```bash
# Usando yarn
yarn install 

# Ou usando npm
npm install
```

4. **Executando a Aplicação:**

```bash
# Usando yarn
yarn dev

# Ou usando npm
npm run dev
```


### 📂 Estrutura do Repositório
O projeto segue uma estrutura modular para facilitar a organização e a escalabilidade:

AtleticaApp-UFPR/
├── next/                # Aplicação Web (Next.js)
    ├── api/             # Lógica de comunicação com APIs
        ├── routes/      # Rotas das APIs
    ├── app/             # Páginas e rotas do Next.js (App Router)
    ├── assets/          # Arquivos estáticos, como imagens e ícones
    ├── components/      # Componentes reutilizáveis
    ├── hooks/           # Hooks customizados
    ├── interfaces/      # Definições de tipos e interfaces (TypeScript)
    ├── mock/            # Dados mock para desenvolvimento e testes
    ├── screens/         # Telas principais da aplicação

Essa organização promove a modularidade e facilita a manutenção do código.


### 📄 Notas Importantes
1. Este projeto suporta tanto Yarn quanto NPM. Escolha um e utilize consistentemente.
2. Certifique-se de ter o Node.js instalado na versão mínima recomendada (18.x ou superior).
3. O projeto utiliza o Next.js App Router, permitindo uma abordagem moderna e escalável para a construção de rotas e páginas.
4. A estrutura de pastas foi projetada para separar responsabilidades e melhorar a clareza do código.
