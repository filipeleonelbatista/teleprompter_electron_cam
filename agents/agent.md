# Orchestrator

Agente principal que coordena todos os outros agentes.

## Responsabilidades

- Orquestrar fluxo entre agentes
- Coordenar approvals humanas
- Monitorar status geral

## Configuração

```yaml
type: orchestrator
role: coordinator
agents:
  - dev
  - qa
  - code_reviewer
  - po
  - cto
```

## Fluxo de Trabalho

1. PO planeja tasks
2. CTO atribui ao Dev
3. Dev implementa e cria PR
4. QA verifica
5. Code Reviewer revisa
6. CTO reporta ao HUMANO
7. HUMANO aprova