# Teleprompter Electron Cam - Tasks

Kanban de acompanhamento do projeto. Cada coluna representa um agente responsável.

## Legenda
- 🔴 Alta prioridade
- 🟡 Média prioridade
- 🟢 Baixa prioridade
- ⏳ Pendente
- 🔄 Em progresso
- ✅ Concluído

---

## 🔄 PO (Product Owner) - Planejamento

| Task | Prioridade | Status | Dependência |
|------|------------|--------|-------------|
| Levantamento de requisitos | 🔴 | ✅ | - |
| Priorizar funcionalidades MVP | 🔴 | ✅ | Levantamento |
| Definir critérios de aceite | 🟡 | ✅ | Priorização |
| Criar roadmap de releases | 🟢 | ⏳ | - |
| Criar CI/CD pipeline | 🔴 | ✅ | Build |

---

## 🔄 Dev (Desenvolvimento)

| Task | Prioridade | Status | Dependência |
|------|------------|--------|-------------|
| Setup inicial (npm, TypeScript, ESLint) | 🔴 | ✅ | PO: Requisitos |
| Configurar Vitest/Jest | 🟡 | ✅ | Setup |
| Configurar Husky | 🟡 | ✅ | Testes |
| Criar estrutura de pastas (Atomic) | 🔴 | ✅ | Setup |
| Implementar janela overlay transparente | 🔴 | ✅ | Estrutura |
| Implementar input de texto | 🔴 | ✅ | Janela |
| Implementar rolagem automática | 🔴 | ✅ | Input texto |
| Controles de velocidade e fonte | 🔴 | ✅ | Rolagem |
| Persistência de configurações | 🟢 | ⏳ | Controles |
| Testes unitários (86% cobertura) | 🔴 | ✅ | Implementação |
| Build de produção | 🔴 | ✅ | Testes |
| CI GitHub Actions (Windows/macOS/Linux) | 🔴 | ⏳ | Build |

---

## 🔄 QA (Quality Assurance)

| Task | Prioridade | Status | Dependência |
|------|------------|--------|-------------|
| Criar plano de testes | 🔴 | ✅ | PO: Critérios |
| Testar janela overlay transparente | 🔴 | ⏳ | Dev: Janela |
| Testar rolagem e controles | 🔴 | ⏳ | Dev: Rolagem |
| Testar com OBS/captura de tela | 🔴 | ⏳ | Overlay |
| Teste E2E (Playwright) | 🟡 | ⏳ | Build |
| Validação executável (Win/Mac/Linux) | 🔴 | ⏳ | Build |

---

## 🔄 Code Reviewer

| Task | Prioridade | Status | Dependência |
|------|------------|--------|-------------|
| Revisar setup inicial | 🔴 | ⏳ | Dev: Setup |
| Revisar estrutura de código | 🔴 | ⏳ | Dev: Estrutura |
| Revisar implementação core | 🔴 | ⏳ | Dev: MVP |
| Revisar testes | 🔴 | ⏳ | Dev: Testes |
| Revisar PR de release | 🔴 | ⏳ | Build |

---

## 🔄 CTO (Arquitetura)

| Task | Prioridade | Status | Dependência |
|------|------------|--------|-------------|
| Definir stack técnica | 🔴 | ✅ | - |
| Revisar arquitetura (Clean Code/SOLID) | 🟡 | ✅ | Dev: Estrutura |
| Validar escolhas de libs | 🟡 | ✅ | Setup |
| Performance e otimização | 🟡 | ⏳ | Implementação |

---

## Fluxo de Trabalho

```
PO → Dev → Code Review → QA → CTO → Release
         ↑              ↓
         └──────────────┘
```

---

## Próximos Passos Imediatos

- [x] Setup inicial completo do projeto
- [x] UI Teleprompter funcional
- [x] Testes unitários (86% cobertura)
- [x] Build Linux funcionando
- [ ] Fazer commit inicial e push para GitHub
- [ ] Criar arquivo `.github/workflows/build.yml`
- [ ] Testar aplicação em Linux (`./release/linux-unpacked`)
- [ ] Criar persistência de configurações (localStorage)
- [ ] Adicionar testes E2E com Playwright

---

## Resumo do Progresso

### Concluído ✅ (Coluna Dev)
- Setup inicial Electron + React + TypeScript + Vite
- ESLint + Prettier + TypeScript configurados
- Vitest com Testing Library (86% coverage)
- Husky com pre-commit e commit-msg hooks
- Estrutura Atomic Design (`src/components/atoms/`)
- Hook `useTeleprompter` para lógica de estado
- UI Teleprompter completa:
  - Janela transparente overlay
  - Input de texto lateral
  - Controles: play/pause, font size, speed, opacity
  - Botões de janela (min/max/close)
- Build Linux AppImage (~100MB)
- Comandos: `npm run lint`, `npm run typecheck`, `npm test`

### Pendente ⏳
- CI GitHub Actions (criar `.github/workflows/build.yml`)
- Persistência de configurações (localStorage)
- Windows/macOS build (via CI)
- Testes E2E com Playwright
- Teste com OBS/captura de tela