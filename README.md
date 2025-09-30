# Frontend Angular - CRUD - Sistema para Gestão de Clientes, Pedidos e Usuários  

Este projeto consiste em uma aplicação web desenvolvida em **Angular 14** para o gerenciamento completo de clientes, pedidos e usuários.  
O sistema permite realizar operações CRUD em clientes e pedidos, emitir notas fiscais, controlar usuários cadastrados com perfil e permissões de acesso, além de visualizar um **dashboard analítico** com os principais gastos por cliente.  

O objetivo do projeto é centralizar e otimizar o controle comercial, facilitando a análise de dados e a gestão das informações empresariais.  

## 🚀 Funcionalidades Principais  
- **Gestão de Clientes:** cadastro, atualização, exclusão e consulta de clientes.  
- **Gestão de Pedidos:** criação, edição, exclusão e emissão de nota fiscal.  
- **Controle de Usuários:** cadastro de usuários, definição de perfis e permissões de acesso.  
- **Dashboard Analítico:** visualização de gastos por cliente, permitindo análise de desempenho e tendências de consumo.  
- **CI/CD e Deploy Automatizado:** workflow via GitHub Actions para publicação automática, integrado com backend containerizado via Docker.  

## 🛠 Tecnologias Utilizadas  
- Angular 14  
- TypeScript  
- HTML & CSS  
- Angular Material UI  
- Node.js & NPM  

## ⚙️ DevOps / CI/CD  
- GitHub Actions para publicação automatizada  
- Docker para containerização  

## 📂 Controle de Versão  
- Git & GitHub  

## 📌 Pré-requisitos  
Antes de executar o projeto, certifique-se de ter instalado em sua máquina:  
- **Node.js >= 18.x**  
- **Angular CLI >= 14.x**  
- **Backend da aplicação em execução:** [transp-api-crud-spring](https://github.com/ricvecchio/transp-api-crud-spring)  

## 📁 Estrutura do Projeto  
- `src/app/components` – Componentes Angular da aplicação  
- `src/app/services` – Serviços de integração com o backend  
- `src/app/models` – Modelos de dados  
- `src/app/pages` – Páginas do sistema (clientes, pedidos, usuários, dashboard)  
- `docs/images` – Prints de telas para documentação  

## ▶️ Como Executar  
```bash
# Clone este repositório
git clone https://github.com/ricvecchio/transp-crud-angular.git

# Acesse a pasta do projeto
cd transp-crud-angular

# Instale as dependências
npm install

# Execute a aplicação
ng serve

# Acesse no navegador
http://localhost:4200
