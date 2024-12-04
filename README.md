# WhatsApp GLPI Integration Bot

Este guia detalhado explica como configurar e executar o bot de integração WhatsApp-GLPI.

## Requisitos do Sistema

### 1. Servidor Ubuntu
- Ubuntu Server 20.04 LTS ou superior
- Mínimo 2GB de RAM
- 20GB de espaço em disco
- Conexão à internet estável
- VPN configurada e funcionando

### 2. Software Necessário
- Node.js 16 ou superior
  ```bash
  # Instalação do Node.js no Ubuntu
  curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
  sudo apt-get install -y nodejs
  ```
- NPM (vem com Node.js)
- Git
  ```bash
  sudo apt-get install git
  ```

### 3. GLPI Configurado
- GLPI 10.0 ou superior instalado
- Autenticação OAuth IMAP configurada com Office 365
- API REST ativada

## Instalação Passo a Passo

### 1. Preparação do Ambiente

1.1. Crie um diretório para o projeto:
```bash
mkdir whatsapp-glpi-bot
cd whatsapp-glpi-bot
```

1.2. Clone o repositório:
```bash
git clone [url-do-repositorio] .
```

1.3. Instale as dependências:
```bash
npm install
```

### 2. Configuração do GLPI

2.1. Ativação da API REST:
- Acesse: Configuração > Geral > API
- Ative a API REST
- Anote a URL da API

2.2. Geração de Tokens:
- Acesse: Configuração > Geral > API
- Clique em "Gerar novo token"
- Selecione permissões:
  - Tickets: Leitura/Escrita
  - Usuários: Leitura/Escrita
- Anote o App Token gerado

2.3. Configuração do Webhook:
- Acesse: Configuração > Notificações
- Adicione novo webhook
- URL: `http://seu-servidor:3000/webhook/ticket-update`
- Eventos para monitorar:
  - Criação de ticket
  - Atualização de ticket
  - Comentários
  - Atribuição

### 3. Configuração do Office 365

3.1. Registro do Aplicativo:
- Acesse portal.azure.com
- Azure Active Directory > Registros de Aplicativo
- Novo registro
- Anote:
  - Client ID
  - Client Secret
  - Tenant ID

3.2. Configuração de Permissões:
- Adicione permissões:
  - IMAP.AccessAsUser.All
  - User.Read
  - Mail.Read

### 4. Configuração do Bot

4.1. Configure o arquivo .env:
```bash
cp .env.example .env
nano .env
```

4.2. Preencha as variáveis:
```
# WhatsApp Configuration
WHATSAPP_SESSION_FILE=./whatsapp-session.json

# GLPI Configuration
GLPI_URL=https://seu-glpi.com
GLPI_APP_TOKEN=seu-app-token
GLPI_USER_TOKEN=seu-user-token

# Office 365 Configuration
O365_CLIENT_ID=seu-client-id
O365_CLIENT_SECRET=seu-client-secret
O365_TENANT_ID=seu-tenant-id

# NLP Configuration
NLP_LANGUAGE=pt
```

### 5. Iniciando o Bot

5.1. Primeira execução:
```bash
npm start
```

5.2. Autenticação do WhatsApp:
- Um QR Code aparecerá no terminal
- Abra o WhatsApp no celular
- Menu > WhatsApp Web
- Escaneie o QR Code

5.3. Verificação:
- Envie uma mensagem para o número do WhatsApp
- O bot deve responder

### 6. Configuração do Serviço (Opcional)

6.1. Criar serviço systemd:
```bash
sudo nano /etc/systemd/system/whatsapp-glpi-bot.service
```

6.2. Adicione o conteúdo:
```ini
[Unit]
Description=WhatsApp GLPI Bot
After=network.target

[Service]
Type=simple
User=seu-usuario
WorkingDirectory=/caminho/para/whatsapp-glpi-bot
ExecStart=/usr/bin/npm start
Restart=always

[Install]
WantedBy=multi-user.target
```

6.3. Ative o serviço:
```bash
sudo systemctl enable whatsapp-glpi-bot
sudo systemctl start whatsapp-glpi-bot
```

## Uso do Bot

### Comandos Disponíveis
1. Abertura de Chamado:
   - "Preciso abrir um chamado"
   - "Novo ticket"
   - "Problema técnico"

2. Autenticação:
   - "Fazer login"
   - "Autenticar"

3. Atualização de Contato:
   - "Atualizar contato"
   - "Atualizar número"

### Fluxo de Uso
1. Primeiro Acesso:
   - Envie mensagem para o bot
   - Bot solicitará email corporativo
   - Faça login com credenciais do Office 365

2. Abertura de Chamado:
   - Solicite abertura de chamado
   - Bot pedirá descrição do problema
   - Forneça detalhes
   - Bot confirmará abertura

3. Acompanhamento:
   - Bot enviará atualizações automáticas
   - Você pode responder diretamente

## Solução de Problemas

### Logs
- Verifique os arquivos de log:
  ```bash
  tail -f error.log
  tail -f combined.log
  ```

### Problemas Comuns

1. QR Code não aparece:
   - Verifique conexão com internet
   - Reinicie o serviço
   ```bash
   sudo systemctl restart whatsapp-glpi-bot
   ```

2. Erro de autenticação Office 365:
   - Verifique credenciais no .env
   - Confirme permissões no Azure AD

3. Webhook não funciona:
   - Verifique firewall
   - Confirme URL do webhook
   - Verifique logs do GLPI

## Manutenção

### Backup
1. Dados importantes para backup:
   - Arquivo .env
   - whatsapp-session.json
   - Logs

2. Comando para backup:
```bash
tar -czf backup-bot.tar.gz .env whatsapp-session.json *.log
```

### Atualizações
1. Atualizar dependências:
```bash
npm update
```

2. Verificar atualizações do sistema:
```bash
sudo apt update && sudo apt upgrade
```

## Suporte e Ajuda

### Canais de Suporte
- Abra uma issue no repositório
- Documentação do GLPI: [link]
- Documentação WhatsApp Web JS: [link]

### Contatos
- Suporte Técnico: [email/telefone]
- Emergências: [contato]