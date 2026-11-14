# Kesh Dashboard — página de serviços locais

Página inicial simples para o servidor: cartões com os serviços que rodam na máquina (Nginx, Apache e outros), cada um com endereço, porta, ícone e cor.

- Adicionar, editar e apagar serviços pela própria página (guardados no navegador, `localStorage` em `kesh-dashboard-services:v1`).
- Tema claro/escuro (`src/hooks/useTheme.ts`).
- Serviços padrão em `src/constants.ts`.

**Stack:** React 18 + Vite + TypeScript + Tailwind, ícones `lucide-react`.

## Rodar
```bash
npm install
npm run dev      # desenvolvimento
npm run build    # gera dist/
```

## Publicação
`deploy/` tem o guia e os scripts antigos de publicação (WSL/nginx). O workflow `.github/workflows/deploy.yml` compila no GitHub Actions a cada push na `main`.
