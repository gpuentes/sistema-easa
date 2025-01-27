import { Snackbar, Alert } from '@mui/material';

interface NotificationProps {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'info' | 'warning';
  onClose: () => void;
}

export default function Notification({ open, message, severity, onClose }: NotificationProps) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert onClose={onClose} severity={severity} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
} 