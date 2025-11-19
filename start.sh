#!/usr/bin/env bash

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Função para print colorido
print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_title() {
    echo -e "${CYAN}🚀 $1${NC}"
}

# Função para verificar se Docker está rodando
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker não está rodando! Por favor, inicie o Docker."
        exit 1
    fi
}

# Função para verificar se Node.js está instalado
check_node() {
    if ! command -v node &> /dev/null; then
        print_error "Node.js não está instalado! Necessário para modo debug."
        exit 1
    fi
}

# Função para verificar se npm está instalado
check_npm() {
    if ! command -v npm &> /dev/null; then
        print_error "npm não está instalado! Necessário para modo debug."
        exit 1
    fi
}

# Função para mostrar menu
show_menu() {
    clear
    print_title "PREPARAME API - STARTUP SCRIPT"
    echo ""
    echo "Escolha como deseja iniciar o ambiente:"
    echo ""
    echo "1) 🐳 Ambiente Completo (Docker)"
    echo "   - Aplicação + Banco no Docker"
    echo "   - Recomendado para produção/demo"
    echo ""
    echo "2) 🐛 Modo Debug (Desenvolvimento)"
    echo "   - Apenas banco no Docker"
    echo "   - Node.js local com debugger VS Code"
    echo "   - Ideal para desenvolvimento"
    echo ""
    echo "3) 🗄️  Apenas Banco PostgreSQL"
    echo "   - Só o banco de dados"
    echo "   - Para testes ou uso externo"
    echo ""
    echo "4) ⏹️  Parar Todos os Serviços"
    echo "   - Para todos os containers"
    echo ""
    echo "5) 🚪 Sair"
    echo ""
}

# Função para ambiente completo
start_full() {
    print_info "Iniciando ambiente completo no Docker..."
    check_docker
    docker-compose down > /dev/null 2>&1
    docker-compose up --build -d
    
    if [ $? -eq 0 ]; then
        print_success "Ambiente completo iniciado!"
        print_info "API rodando em: http://localhost:3334"
        print_info "Para ver logs: docker-compose logs -f"
    else
        print_error "Erro ao iniciar ambiente completo"
        exit 1
    fi
}

# Função para modo debug
start_debug() {
    print_info "Iniciando modo debug (banco Docker + Node local)..."
    check_docker
    check_node
    check_npm
    
    # Parar ambiente completo se estiver rodando
    docker-compose down > /dev/null 2>&1
    
    # Iniciar apenas banco
    docker-compose -f docker-compose-db.yml up -d
    
    if [ $? -eq 0 ]; then
        print_success "Banco PostgreSQL iniciado!"
        print_info "Aguardando banco estar pronto..."
        
        # Aguardar banco estar pronto
        for i in {1..30}; do
            if docker-compose -f docker-compose-db.yml exec -T database pg_isready -U docker > /dev/null 2>&1; then
                break
            fi
            sleep 1
        done
        
        print_success "Banco pronto!"
        print_info "Criando ormconfig.json para desenvolvimento local..."
        
        # Criar ormconfig para desenvolvimento local
        cat > ormconfig.json << EOF
{
    "type": "postgres",
    "port": 5435,
    "host": "localhost", 
    "username": "docker",
    "password": "admin@01",
    "database": "preparame",
    "synchronize": false,
    "logging": false,
    "migrations": ["./src/shared/infra/typeorm/migrations/*.ts"],
    "entities": ["./src/modules/**/entities/*.ts"],
    "cli": {
        "migrationsDir": "./src/shared/infra/typeorm/migrations"
    }
}
EOF
        
        print_success "Ambiente de debug configurado!"
        print_warning "Para usar o debugger:"
        echo "  1. Abra o VS Code"
        echo "  2. Vá para 'Run and Debug' (Ctrl+Shift+D)"
        echo "  3. Selecione 'Debug Preparame API'"
        echo "  4. Pressione F5"
        echo ""
        print_warning "⚠️  Se for a primeira vez, execute:"
        echo "  npm install"
        echo "  npm run typeorm migration:run"
        echo ""
        print_info "Ou execute manualmente: npm run dev"
        
    else
        print_error "Erro ao iniciar banco PostgreSQL"
        exit 1
    fi
}

# Função para apenas banco
start_db_only() {
    print_info "Iniciando apenas banco PostgreSQL..."
    check_docker
    docker-compose down > /dev/null 2>&1
    docker-compose -f docker-compose-db.yml up -d
    
    if [ $? -eq 0 ]; then
        print_success "Banco PostgreSQL iniciado!"
        print_info "Conexão: localhost:5435"
        print_info "Usuário: docker | Senha: admin@01 | Database: preparame"
    else
        print_error "Erro ao iniciar banco PostgreSQL"
        exit 1
    fi
}

# Função para parar serviços
stop_services() {
    print_info "Parando todos os serviços..."
    docker-compose down > /dev/null 2>&1
    docker-compose -f docker-compose-db.yml down > /dev/null 2>&1
    print_success "Todos os serviços foram parados!"
}

# Menu principal
while true; do
    show_menu
    read -p "Digite sua escolha (1-5): " choice
    
    case $choice in
        1)
            start_full
            echo ""
            read -p "Pressione Enter para voltar ao menu..."
            ;;
        2)
            start_debug
            echo ""
            read -p "Pressione Enter para voltar ao menu..."
            ;;
        3)
            start_db_only
            echo ""
            read -p "Pressione Enter para voltar ao menu..."
            ;;
        4)
            stop_services
            echo ""
            read -p "Pressione Enter para voltar ao menu..."
            ;;
        5)
            print_info "Saindo..."
            exit 0
            ;;
        *)
            print_error "Opção inválida! Escolha entre 1-5."
            sleep 2
            ;;
    esac
done