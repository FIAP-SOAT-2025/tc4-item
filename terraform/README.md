# Projeto de Implantação de API em EKS com Terraform

Este projeto automatiza a implantação de uma aplicação em contêiner em um cluster Amazon EKS (Elastic Kubernetes Service) usando Terraform. A infraestrutura inclui a configuração de recursos Kubernetes, como `Deployment`, `Service`, `ConfigMap`, `Secrets`, e a integração com o AWS API Gateway.

## Visão Geral da Arquitetura

A arquitetura consiste nos seguintes componentes:

- **Amazon EKS**: O cluster Kubernetes onde a aplicação é implantada.
- **AWS API Gateway (V2)**: Atua como um proxy para as requisições à aplicação, utilizando um `VPC Link` para comunicação privada.
- **Kubernetes**:
  - `Deployment`: Gerencia os pods da aplicação.
  - `Service`: Expõe a aplicação através de um Network Load Balancer (NLB).
  - `ConfigMap` e `Secrets`: Gerenciam a configuração e os segredos da aplicação.
  - `Ingress`: Configura o roteamento de entrada para a aplicação.
- **Terraform**: Orquestra a criação e o gerenciamento de todos os recursos da infraestrutura como código.
- **GitHub Actions**: Automatiza o processo de CI/CD para implantação e destruição da infraestrutura.

## Pré-requisitos

Antes de iniciar, certifique-se de que os seguintes pré-requisitos sejam atendidos:

- Um cluster EKS existente.
- Um namespace de banco de dados (`lanchonete-db`) com um serviço de banco de dados em execução.
- As credenciais da AWS configuradas corretamente no ambiente onde o Terraform será executado.
- O backend do Terraform (S3 bucket) criado para armazenar o estado remoto.

## Como Usar

### Variáveis de Configuração

As variáveis do Terraform estão definidas no arquivo `vars.tf`. As variáveis sensíveis, como credenciais de banco de dados e tokens de acesso, devem ser fornecidas em um arquivo `.tfvars` ou através de variáveis de ambiente.

Principais variáveis:

- `aws_region`: A região da AWS onde os recursos serão implantados.
- `projectName`: O nome do projeto.
- `db_user`, `db_password`, `db_name`: Credenciais do banco de dados.
- `access_token`: Token de acesso para integração com APIs externas.

### Implantação Manual

1.  **Inicialize o Terraform:**
    ```bash
    terraform init
    ```

2.  **Planeje a implantação:**
    ```bash
    terraform plan
    ```

3.  **Aplique a configuração:**
    ```bash
    terraform apply
    ```

### Destruição da Infraestrutura

Para remover todos os recursos criados pelo Terraform, execute:

```bash
terraform destroy
```

## CI/CD com GitHub Actions

O fluxo de trabalho de CI/CD, definido em `.github/workflows/terraform.yml`, automatiza a implantação e a destruição da infraestrutura.

- **Gatilhos**: O workflow é acionado por `push` nas branches `main` e `develop`, `pull_request` para a `main`, ou manualmente através do `workflow_dispatch`.
- **Jobs**:
  - `check-dependencies`: Verifica se o cluster EKS e o namespace do banco de dados existem.
  - `terraform-check`: Executa `terraform init`, `fmt`, `validate`, e `plan`.
  - `terraform-apply`: Aplica a configuração do Terraform quando há um push na `main` ou o workflow é acionado com a ação `apply`.
  - `terraform-destroy`: Destrói a infraestrutura quando o workflow é acionado com a ação `destroy`.

## Estrutura do Projeto

- `data.tf`: Define fontes de dados do Terraform, como o Load Balancer e o remote state.
- `k8s-*.tf`: Define os recursos do Kubernetes a serem implantados no cluster EKS.
- `provider.tf`: Configura os providers do Terraform (AWS, Kubernetes, Kubectl).
- `vars.tf`: Declara as variáveis de entrada do Terraform.
- `outputs.tf`: Define os outputs do Terraform.
- `api-gateway-integration/`: Módulo Terraform para configurar a integração com o API Gateway.
- `.github/workflows/terraform.yml`: Define o pipeline de CI/CD com GitHub Actions.
