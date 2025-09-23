import React, { useEffect, useRef } from 'react';
import { Box, Typography } from '@mui/material';

interface SSEOutputAreaProps {
  messages: string[];
}

const SSEOutputArea = ({ messages }: SSEOutputAreaProps) => {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <Box
      sx={{
        border: '1px solid #ccc',
        borderRadius: 1,
        padding: 2,
        minHeight: '200px',
        maxHeight: '400px',
        overflowY: 'auto',
        backgroundColor: '#f9f9f9',
        fontFamily: 'monospace',
      }}
    >
      {messages.length > 0 &&
        messages.map((msg, index) => (
          <Typography
            key={index}
            variant="body2"
            sx={{ whiteSpace: 'pre-wrap' }}
          >
            {msg}
          </Typography>
        ))
      }
      <div ref={bottomRef} />
    </Box>
  );
};

export default SSEOutputArea;
