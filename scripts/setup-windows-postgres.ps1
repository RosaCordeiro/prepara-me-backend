#Requires -RunAsAdministrator
<#
.SYNOPSIS
    Instala e configura PostgreSQL no Windows para o Prepara-me.
.DESCRIPTION
    - Cria usuario/database compatíveis com o backend
    - Libera conexões vindas do WSL e do Docker
    - Mantém os dados fora do WSL (sobrevive a reinstalações)
#>
param(
    [string]$DbUser = "docker",
    [string]$DbPass = "admin@01",
    [string]$DbName = "preparame",
    [int]$Port = 5432
)

$ErrorActionPreference = "Stop"

function Write-Step($message) {
    Write-Host "[preparame-db] $message" -ForegroundColor Cyan
}

function Find-PostgresInstall {
    $base = "C:\Program Files\PostgreSQL"
    if (-not (Test-Path $base)) { return $null }

    Get-ChildItem $base -Directory |
        Sort-Object Name -Descending |
        Select-Object -First 1
}

function Ensure-PostgresInstalled {
    $install = Find-PostgresInstall
    if ($install) {
        Write-Step "PostgreSQL encontrado em $($install.FullName)"
        return $install
    }

    Write-Step "PostgreSQL não encontrado. Tentando instalar via winget..."
    winget install --id PostgreSQL.PostgreSQL.13 --accept-package-agreements --accept-source-agreements
    Start-Sleep -Seconds 5
    return Find-PostgresInstall
}

function Get-PostgresService {
    Get-Service -Name "postgresql*" -ErrorAction SilentlyContinue |
        Where-Object { $_.Status -eq "Running" -or $_.Status -eq "Stopped" } |
        Select-Object -First 1
}

Write-Step "Configurando PostgreSQL no Windows..."

$installDir = Ensure-PostgresInstalled
if (-not $installDir) {
    throw "Não foi possível localizar a instalação do PostgreSQL."
}

$binDir = Join-Path $installDir.FullName "bin"
$dataDir = Join-Path $installDir.FullName "data"
$psql = Join-Path $binDir "psql.exe"

if (-not (Test-Path $psql)) {
    throw "psql.exe não encontrado em $binDir"
}

$service = Get-PostgresService
if (-not $service) {
    throw "Serviço postgresql* não encontrado. Verifique a instalação."
}

if ($service.Status -ne "Running") {
    Write-Step "Iniciando serviço $($service.Name)..."
    Start-Service $service.Name
}

$pgConf = Join-Path $dataDir "postgresql.conf"
$pgHba = Join-Path $dataDir "pg_hba.conf"

if (Test-Path $pgConf) {
    $conf = Get-Content $pgConf
    if ($conf -notmatch "listen_addresses\s*=\s*'\*'") {
        Write-Step "Ajustando listen_addresses em postgresql.conf..."
        if ($conf -match "^#?\s*listen_addresses\s*=") {
            $conf = $conf -replace "^#?\s*listen_addresses\s*=.*", "listen_addresses = '*'"
        } else {
            $conf += "`nlisten_addresses = '*'"
        }
        Set-Content -Path $pgConf -Value $conf -Encoding UTF8
    }
}

$hbaEntries = @(
    "host    all             all             127.0.0.1/32            scram-sha-256",
    "host    all             all             172.16.0.0/12           scram-sha-256",
    "host    all             all             192.168.0.0/16          scram-sha-256"
)

if (Test-Path $pgHba) {
    $hba = Get-Content $pgHba
    foreach ($entry in $hbaEntries) {
        if ($hba -notcontains $entry) {
            Write-Step "Adicionando regra pg_hba: $entry"
            Add-Content -Path $pgHba -Value $entry
        }
    }
}

Write-Step "Abrindo porta $Port no firewall do Windows..."
netsh advfirewall firewall delete rule name="Preparame PostgreSQL" > $null 2>&1
netsh advfirewall firewall add rule name="Preparame PostgreSQL" dir=in action=allow protocol=TCP localport=$Port | Out-Null

Write-Step "Reiniciando serviço PostgreSQL..."
Restart-Service $service.Name

Write-Step "Criando usuário e database..."
$env:PGPASSWORD = "postgres"
$superPassPrompt = @"
DO `$`$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = '$DbUser') THEN
        CREATE ROLE $DbUser LOGIN PASSWORD '$DbPass';
    ELSE
        ALTER ROLE $DbUser WITH LOGIN PASSWORD '$DbPass';
    END IF;
END
`$`$;
"@

try {
    & $psql -U postgres -d postgres -v ON_ERROR_STOP=1 -c $superPassPrompt
    $createDbSql = @"
DO `$`$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_database WHERE datname = '$DbName') THEN
        CREATE DATABASE $DbName OWNER $DbUser;
    END IF;
END
`$`$;
"@
    & $psql -U postgres -d postgres -v ON_ERROR_STOP=1 -c $createDbSql
} catch {
    Write-Host "Não foi possível autenticar como postgres com senha vazia." -ForegroundColor Yellow
    Write-Host "Execute manualmente no pgAdmin ou psql como superusuário:" -ForegroundColor Yellow
    Write-Host "  CREATE ROLE $DbUser LOGIN PASSWORD '$DbPass';" -ForegroundColor Yellow
    Write-Host "  CREATE DATABASE $DbName OWNER $DbUser;" -ForegroundColor Yellow
}

Write-Step "Concluído."
Write-Host ""
Write-Host "Conexão a partir do WSL:" -ForegroundColor Green
Write-Host "  host: (IP do Windows via /etc/resolv.conf)"
Write-Host "  port: $Port"
Write-Host "  user: $DbUser"
Write-Host "  pass: $DbPass"
Write-Host "  db:   $DbName"
Write-Host ""
Write-Host "Conexão a partir do container Docker:" -ForegroundColor Green
Write-Host "  host: host.docker.internal"
Write-Host "  port: $Port"
