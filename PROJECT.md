# Teleprompter Electron Cam

Aplicação Electron que exibe um overlay de teleprompter sobre os elementos da tela, ideal para apresentações e transmissões ao vivo.

## Funcionalidades

- Overlay transparente que fica acima de todos os elementos da tela
- Velocidade de rolagem configurável
- Tamanho da fonte ajustável
- Tamanho e posicionamento da janela customizáveis
- Opacidade do texto configurável
- Transparente para captura de tela (compatível com OBS e outros softwares de captura)
- Tema escuro por padrão

## Cross-Platform

- Linux
- Windows
- macOS

## Stack

- Electron
- TypeScript
- React
- Tailwind CSS
- shadcn/ui

## Princípios de Código

Para projetos pequenos, os seguintes princípios são recomendados:

### Clean Code
- Funções pequenas (Single Responsibility)
- Nomes significativos
- Código legível e autoexplicativo
- Evite duplicação

### Clean Architecture
- Separação em camadas: UI, business logic, data
- Dependências pointing inward
- Fácil de testar e manter

### SOLID
- **S**ingle Responsibility: uma responsabilidade por módulo
- **O**pen/Closed: aberto para extensão, fechado para modificação
- **L**iskov Substitution: subtipos devem substituir base types
- **I**nterface Segregation: interfaces pequenas
- **D**ependency Inversion: dependência de abstrações

### TDD
- Red → Green → Refactor
- Teste antes da implementação
- Cobertura mínima 90%

### Atomic Design (Frontend)
- **Atoms**: Elementos individuais (botões, inputs)
- **Molecules**: Combinações de atoms
- **Organisms**: Componentes compostos
- **Templates**: Layouts de páginas
- **Pages**: Páginas completas

### Testes E2E (Frontend)
- Playwright ou Cypress
- Testes de fluxos completos
- Garantem funcionamento real