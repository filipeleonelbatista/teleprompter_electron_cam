# Agents

Este arquivo contém instruções para assistentes de IA que trabalham neste projeto.

## Visão Geral do Projeto

Aplicação Electron que exibe um overlay de teleprompter sobre os elementos da tela, ideal para apresentações e transmissões ao vivo. O overlay deve ser transparente para captura de tela (compatível com OBS).

## Workflow de Desenvolvimento

Para manter a qualidade do código, utilize o seguinte fluxo de desenvolvimento incremental:

### Passo 1: Setup Inicial
Configure primeiro a estrutura básica do projeto:
- Configurar TypeScript e ESLint
- Configurar Jest ou Vitest para testes unitários
- Configurar Husky para pre-commit hooks
- Criar estrutura básica de pastas

### Passo 2: QA e Testes
Após a estrutura básica, implemente:
- Testes unitários com cobertura mínima de 90%
- QA hooks no Husky rodando antes dos commits

### Passo 3: Code Review
Após testes passando, configure:
- Code Reviewer agent para revisar PRs
- Validação automática emPull Requests

### Passo 4: Automação
Quando o básico estiver rodando:
- Adicionar comentarios automáticos ao PR com mudanças implementadas
- Commits automáticos com changelog das implementações

## Princípios de Código

### Clean Code
- Funções pequenas e com responsabilidade única (SRP)
- Nomes significativos e descritivos
- Classes e módulos coesos
- Baixo acoplamento entre módulos
- Código legível e autoexplicativo
- Evite código duplicado
- Prefira composição sobre herança

### TDD (Test Driven Development)
- Siga o ciclo: Red → Green → Refactor
- Escreva o teste antes da implementação
- Execute testes frequentemente
- Refatore com segurança tendo testes passando
- Cada teste deve cobrir uma única funcionalidade

## Principais Comandos

```bash
npm install         # Instalar dependências
npm run dev         # Iniciar servidor de desenvolvimento
npm run build      # Build para produção
npm run lint       # Rodar linter
npm run typecheck  # Rodar verificador de tipos
npm run test       # Rodar testes
npm run test:cov   # Rodar testes com coverage
```

## Padrões de Código

- Siga o estilo de código existente
- Use TypeScript para todo novo código
- Adicione comentários apenas quando necessário para lógica complexa
- Teste as mudanças antes de fazer commit
- Rode lint e typecheck antes de construir