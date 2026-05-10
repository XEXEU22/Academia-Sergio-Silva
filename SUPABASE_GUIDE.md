# 🛠️ Guia de Configuração — Supabase

Este guia explica como configurar o seu banco de dados Supabase para que a aplicação funcione corretamente.

## 1. Criar o Projeto no Supabase
1. Vá para [supabase.com](https://supabase.com) e crie um novo projeto.
2. Anote o **URL do Projeto** e a **Anon Key** (API Key).
3. Coloque esses valores no seu arquivo `.env` local.

## 2. Configuração do Banco de Dados (SQL Editor)
No painel do Supabase, vá em **SQL Editor** e execute os arquivos localizados na pasta `/supabase` na seguinte ordem:

### Passo A: Esquema Base
Execute o conteúdo de [schema.sql](./supabase/schema.sql).
> Isso criará as tabelas de perfis, aulas, inscrições, vídeos, planos e assinaturas, além de configurar as políticas de segurança (RLS) e o trigger de novos usuários.

### Passo B: Dados Iniciais
Execute o conteúdo de [seed.sql](./supabase/seed.sql).
> Isso irá popular as tabelas de `plans`, `videos` e `classes` com dados de exemplo.

### Passo C: Migrações de Funcionalidades (Opcional/Se necessário)
Execute os seguintes arquivos para adicionar funcionalidades específicas:
1. [payments_migration.sql](./supabase/payments_migration.sql): Cria a tabela de pagamentos.
2. [students_migration.sql](./supabase/students_migration.sql): Ajustes finos na gestão de alunos.
3. [update_profiles.sql](./supabase/update_profiles.sql): Atualiza colunas extras no perfil.

## 3. Configuração de Autenticação
No painel do Supabase, vá em **Authentication** -> **Providers**:
- Garanta que o provedor **Email** está habilitado.
- (Opcional) Desabilite "Confirm Email" para facilitar testes locais iniciais.

## 4. Configuração de Storage (Opcional)
Se você for fazer upload de fotos de perfil ou vídeos:
1. Vá em **Storage** no painel do Supabase.
2. Crie um bucket público chamado `avatars`.
3. Crie um bucket público chamado `thumbnails`.

---
**Dica**: Se você encontrar erros de permissão, verifique se a extensão `uuid-ossp` está habilitada no Supabase (geralmente já vem habilitada por padrão).
