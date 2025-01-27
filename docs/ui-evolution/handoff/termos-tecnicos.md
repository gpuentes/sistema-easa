# Guia de Terminologia Técnica UI/UX - Sistema ASA

## Componentes de Interface

### Elementos de Feedback
- **Snackbar/Toast Notifications**
  - Implementação: `@mui/material/Snackbar`
  - Uso: Notificações temporárias não-bloqueantes
  - Props principais: `open`, `autoHideDuration`, `onClose`
  - Variantes: success, error, warning, info

### Elementos de Interação
- **Dialog/Modal**
  - Implementação: `@mui/material/Dialog`
  - Anatomia: DialogTitle, DialogContent, DialogActions
  - Props: `open`, `onClose`, `maxWidth`
  - Uso: Interações que requerem foco do usuário

### Elementos de Categorização
- **Chips/Tags**
  - Implementação: `@mui/material/Chip`
  - Props: `label`, `color`, `variant`, `onDelete`
  - Variantes: filled, outlined
  - Cores semânticas: primary, secondary, error, warning, info, success

### Sistema de Layout
- **Grid System**
  - Base: CSS Grid/Flexbox via Material-UI
  - Componentes: Container, Grid, Box
  - Breakpoints: xs, sm, md, lg, xl
  - Spacing: Múltiplos de 8px (theme.spacing)

### Formulários
- **Input Components**
  - TextField: Entrada de texto com variantes
  - Select: Dropdown com suporte a múltipla seleção
  - InputAdornment: Decoradores de input (prefixo/sufixo)
  - FormControl: Wrapper para controles de formulário

## Padrões de Design

### Feedback Visual
- Loading states: CircularProgress, LinearProgress
- Error states: error prop, helperText
- Success states: Validação visual, checkmarks

### Responsividade
- useMediaQuery hook para breakpoints
- Container para largura máxima responsiva
- Grid system para layouts adaptáveis

### Acessibilidade
- ARIA labels
- Contraste de cores
- Navegação por teclado
- Focus management

## Boas Práticas
1. Consistência na implementação de componentes
2. Reutilização de estilos via theme
3. Componentização para reusabilidade
4. Padronização de feedback ao usuário 