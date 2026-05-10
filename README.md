# 🥋 Academia Sergio Silva — Arte da Defesa Pessoal

Este projeto é uma aplicação web premium para a gestão da Academia de Artes Marciais do Mestre Sérgio. Desenvolvido com **React**, **Vite**, **TailwindCSS** e integrado com **Supabase** (Banco de Dados e Auth) e **Vercel** (Hospedagem).

## 🚀 Tecnologias

- **Frontend**: React 19 + TypeScript
- **Estilização**: TailwindCSS + Framer Motion (animações premium)
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Deploy**: Vercel
- **Automação**: Script de auto-deploy para GitHub

## ⚙️ Configuração Local

1.  **Clone o repositório**
2.  **Instale as dependências**:
    ```bash
    npm install
    ```
3.  **Configure as Variáveis de Ambiente**:
    Crie um arquivo `.env` na raiz do projeto (use o `.env.example` como base) e preencha com suas credenciais do Supabase e Gemini.
4.  **Inicie o servidor de desenvolvimento**:
    ```bash
    npm run dev
    ```

## 📦 Deploy e CI/CD

O projeto está configurado para deploy automático na **Vercel** via GitHub.

### Auto-Deploy
Para facilitar o desenvolvimento, use o script de auto-deploy que monitora alterações e faz o push automaticamente:
```bash
npm run auto-deploy
```
*Toda vez que você salvar um arquivo nas pastas `src`, `supabase` ou `public`, o script fará um commit e push automático após 4 segundos de inatividade.*

## 🗄️ Supabase Setup

Para configurar o banco de dados, siga as instruções em [SUPABASE_GUIDE.md](./SUPABASE_GUIDE.md). As migrações de esquema e dados iniciais estão localizadas na pasta `/supabase`.

## 📄 Licença

Privado para Academia Sergio Silva.
