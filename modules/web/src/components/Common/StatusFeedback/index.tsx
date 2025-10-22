import React from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  AlertTitle,
  Button,
  Paper,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Error as ErrorIcon,
  Inbox as EmptyIcon,
} from '@mui/icons-material';

export interface StatusFeedbackProps {
  // Status type
  status: 'loading' | 'empty' | 'error' | 'success' | 'idle';

  // Common properties
  height?: number | string;
  width?: number | string;

  // Loading state
  loadingText?: string;
  loadingSize?: number;

  // Empty state
  emptyText?: string;
  emptyIcon?: React.ReactNode;
  emptyAction?: {
    text: string;
    onClick: () => void;
  };

  // Error state
  error?: {
    title?: string;
    message?: string;
    details?: string;
  };
  errorAction?: {
    text: string;
    onClick: () => void;
  };

  // Success state
  successText?: string;
  successIcon?: React.ReactNode;

  // Custom content
  children?: React.ReactNode;

  // Styles
  variant?: 'default' | 'card' | 'minimal';
  align?: 'center' | 'start' | 'end';
}

export function StatusFeedback({
  status,
  height = 200,
  width = '100%',
  loadingText = 'Loading...',
  loadingSize = 40,
  emptyText = 'No Data',
  emptyIcon,
  emptyAction,
  error,
  errorAction,
  successText = 'Operation Successful',
  successIcon,
  children,
  variant = 'default',
  align = 'center',
}: StatusFeedbackProps) {
  // If status is idle and has children, render children directly
  if (status === 'idle' && children) {
    return <>{children}</>;
  }

  const containerStyle = {
    height,
    width,
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: align === 'center' ? 'center' : align === 'start' ? 'flex-start' : 'flex-end',
    alignItems: 'center',
    padding: variant === 'card' ? 3 : 2,
  };

  const contentStyle = {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    textAlign: 'center' as const,
    maxWidth: 400,
  };

  // Loading state
  if (status === 'loading') {
    return (
      <Box sx={containerStyle}>
        <Box sx={contentStyle}>
          <CircularProgress size={loadingSize} />
          <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
            {loadingText}
          </Typography>
        </Box>
      </Box>
    );
  }

  // Empty state
  if (status === 'empty') {
    const content = (
      <Box sx={contentStyle}>
        {emptyIcon || <EmptyIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />}
        <Typography variant="body1" color="textSecondary" sx={{ mb: 1 }}>
          {emptyText}
        </Typography>
        {emptyAction && (
          <Button
            variant="outlined"
            size="small"
            onClick={emptyAction.onClick}
            sx={{ mt: 1 }}
          >
            {emptyAction.text}
          </Button>
        )}
      </Box>
    );

    return variant === 'card' ? (
      <Paper sx={containerStyle}>
        {content}
      </Paper>
    ) : (
      <Box sx={containerStyle}>
        {content}
      </Box>
    );
  }

  // Error state
  if (status === 'error') {
    const content = (
      <Box sx={contentStyle}>
        <ErrorIcon sx={{ fontSize: 48, color: 'error.main', mb: 2 }} />
        <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
          <AlertTitle>{error?.title || 'Load Failed'}</AlertTitle>
          {error?.message || 'Data loading failed, please try again later'}
          {error?.details && (
            <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
              {error.details}
            </Typography>
          )}
        </Alert>
        {errorAction && (
          <Button
            variant="contained"
            startIcon={<RefreshIcon />}
            onClick={errorAction.onClick}
            size="small"
          >
            {errorAction.text}
          </Button>
        )}
      </Box>
    );

    return variant === 'card' ? (
      <Paper sx={containerStyle}>
        {content}
      </Paper>
    ) : (
      <Box sx={containerStyle}>
        {content}
      </Box>
    );
  }

  // Success state
  if (status === 'success') {
    const content = (
      <Box sx={contentStyle}>
        {successIcon || (
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              backgroundColor: 'success.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 2,
            }}
          >
            <Typography variant="h6" color="white">
              ✓
            </Typography>
          </Box>
        )}
        <Typography variant="body1" color="success.main">
          {successText}
        </Typography>
      </Box>
    );

    return variant === 'card' ? (
      <Paper sx={containerStyle}>
        {content}
      </Paper>
    ) : (
      <Box sx={containerStyle}>
        {content}
      </Box>
    );
  }

  // Default return children
  return <>{children}</>;
}

// Convenience components
export function LoadingFeedback(props: Omit<StatusFeedbackProps, 'status'>) {
  return <StatusFeedback {...props} status="loading" />;
}

export function EmptyFeedback(props: Omit<StatusFeedbackProps, 'status'>) {
  return <StatusFeedback {...props} status="empty" />;
}

export function ErrorFeedback(props: Omit<StatusFeedbackProps, 'status'>) {
  return <StatusFeedback {...props} status="error" />;
}

export function SuccessFeedback(props: Omit<StatusFeedbackProps, 'status'>) {
  return <StatusFeedback {...props} status="success" />;
}