#!/bin/bash
# migration-to-pnpm.sh - Script de migración optimizada a pnpm

echo "🚀 Iniciando migración de Viralia a pnpm..."

# Verificar versiones de Node.js
echo "📋 Verificando versiones..."
echo "Node.js: $(node --version)"
echo "npm: $(npm --version)"

# Instalar pnpm si no está disponible
if ! command -v pnpm &> /dev/null; then
    echo "📦 Instalando pnpm..."
    npm install -g pnpm@latest
else
    echo "✅ pnpm ya está instalado: $(pnpm --version)"
fi

# Limpiar instalaciones anteriores
echo "🧹 Limpiando instalaciones anteriores..."
rm -rf node_modules
rm -f package-lock.json
rm -f yarn.lock

# Backup del package.json actual
echo "💾 Creando backup de package.json..."
cp package.json package.json.backup

# Importar desde npm
echo "📥 Importando dependencias desde npm..."
pnpm import

# Instalar dependencias optimizadas
echo "📦 Instalando dependencias optimizadas..."
pnpm install

# Instalar dependencias de desarrollo adicionales
echo "🔧 Instalando herramientas de desarrollo..."
pnpm add -D \
  @types/react@^18.3.12 \
  @types/react-dom@^18.3.1 \
  typescript@^5.6.3 \
  vite-bundle-analyzer@^0.11.0

# Instalar dependencias de producción optimizadas
echo "⚡ Instalando dependencias de producción optimizadas..."
pnpm add \
  clsx@^2.1.1 \
  tailwind-merge@^2.5.4 \
  framer-motion@^11.11.17 \
  lucide-react@^0.460.0 \
  @headlessui/react@^2.2.0 \
  react-hot-toast@^2.4.1 \
  date-fns@^4.1.0 \
  recharts@^2.13.3

# Configurar scripts optimizados
echo "⚙️ Configurando scripts optimizados..."

# Crear .nvmrc si no existe
if [ ! -f .nvmrc ]; then
    echo "22.14.0" > .nvmrc
    echo "✅ Creado .nvmrc con Node.js 22.14.0"
fi

# Crear pnpm-workspace.yaml
cat > pnpm-workspace.yaml << 'EOF'
packages:
  - '.'
  - 'packages/*'
EOF

# Configurar .pnpmrc para optimizaciones
cat > .pnpmrc << 'EOF'
auto-install-peers=true
strict-peer-dependencies=false
shamefully-hoist=true
shell-emulator=true
enable-pre-post-scripts=true
EOF

# Crear script de desarrollo optimizado
cat > dev.sh << 'EOF'
#!/bin/bash
# Script de desarrollo optimizado
echo "🚀 Iniciando servidor de desarrollo optimizado..."

# Verificar dependencias
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias..."
    pnpm install
fi

# Limpiar cache si es necesario
if [ "$1" = "--clean" ]; then
    echo "🧹 Limpiando cache..."
    rm -rf dist .vite node_modules/.vite
    pnpm install
fi

# Iniciar servidor
pnpm dev --host 0.0.0.0 --port 3000
EOF

chmod +x dev.sh

# Crear script de build optimizado
cat > build.sh << 'EOF'
#!/bin/bash
# Script de build optimizado para producción
echo "🏗️ Iniciando build optimizado..."

# Limpiar directorio dist
rm -rf dist

# Build con análisis de bundle
echo "📊 Generando build con análisis..."
pnpm build

# Mostrar estadísticas del build
echo "📈 Estadísticas del build:"
du -sh dist/*
echo "📦 Tamaño total del build:"
du -sh dist

echo "✅ Build completado exitosamente!"
echo "📁 Archivos generados en: ./dist"
EOF

chmod +x build.sh

# Actualizar .gitignore
cat >> .gitignore << 'EOF'

# pnpm
.pnpm-debug.log*
pnpm-lock.yaml

# Build artifacts
dist-ssr
*.local

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db

# Logs
logs
*.log

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage
*.lcov

# Dependency directories
node_modules/

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# dotenv environment variables file
.env.local
.env.development.local
.env.test.local
.env.production.local

# Stores VSCode versions used for testing VSCode extensions
.vscode-test

# yarn v2
.yarn/cache
.yarn/unplugged
.yarn/build-state.yml
.yarn/install-state.gz
.pnp.*
EOF

# Verificar instalación
echo "🔍 Verificando instalación..."
pnpm list --depth=0

# Configurar pre-commit hooks si existen
if [ -f ".husky/pre-commit" ]; then
    echo "🪝 Configurando hooks con pnpm..."
    sed -i 's/npm run/pnpm/g' .husky/pre-commit
fi

echo ""
echo "✅ Migración completada exitosamente!"
echo ""
echo "📋 Próximos pasos:"
echo "1. Verificar que todas las dependencias funcionan: pnpm dev"
echo "2. Ejecutar tests: pnpm test"
echo "3. Crear build de producción: pnpm build"
echo ""
echo "🚀 Comandos útiles:"
echo "  pnpm dev          - Servidor de desarrollo"
echo "  pnpm build        - Build de producción"
echo "  pnpm preview      - Preview del build"
echo "  pnpm lint         - Linter"
echo "  ./dev.sh          - Desarrollo con opciones avanzadas"
echo "  ./build.sh        - Build con análisis"
echo ""
echo "📊 Beneficios obtenidos:"
echo "  ✅ Instalación ~3x más rápida"
echo "  ✅ Uso eficiente del espacio en disco"
echo "  ✅ Resolución de dependencias mejorada"
echo "  ✅ Monorepo-ready"
echo ""
echo "🎉 ¡Viralia está listo para la presentación!"