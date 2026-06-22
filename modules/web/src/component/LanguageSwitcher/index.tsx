'use client';

import React from 'react';
import {
    FormControl,
    Select,
    MenuItem,
    SelectChangeEvent,
    Box,
    Typography,
} from '@mui/material';
import { Language as LanguageIcon } from '@mui/icons-material';
import { useI18n } from '@/hook/useI18n';

interface LanguageSwitcherProps {
    variant?: 'outlined' | 'standard' | 'filled';
    size?: 'small' | 'medium';
    showIcon?: boolean;
    showLabel?: boolean;
}

export default function LanguageSwitcher({
    variant = 'outlined',
    size = 'small',
    showIcon = true,
    showLabel = false,
}: LanguageSwitcherProps) {
    const { t, getCurrentLanguage, changeLanguage } = useI18n();

    const handleLanguageChange = (event: SelectChangeEvent) => {
        changeLanguage(event.target.value);
    };

    const currentLanguage = getCurrentLanguage();

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {showIcon && <LanguageIcon fontSize="small" />}
            {showLabel && (
                <Typography variant="body2" color="text.secondary">
                    {t('common.language')}:
                </Typography>
            )}
            <FormControl variant={variant} size={size} sx={{ minWidth: 80 }}>
                <Select
                    value={currentLanguage.startsWith('zh') ? 'zh' : 'en'}
                    onChange={handleLanguageChange}
                    displayEmpty
                    sx={{
                        '& .MuiSelect-select': {
                            py: 0.5,
                        },
                    }}
                >
                    <MenuItem value="en">
                        {t('common.english')}
                    </MenuItem>
                    <MenuItem value="zh">
                        {t('common.chinese')}
                    </MenuItem>
                </Select>
            </FormControl>
        </Box>
    );
}
