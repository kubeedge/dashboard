'use client';
import * as React from 'react';
import {
  AppBar, Toolbar, Typography, CssBaseline, Box, Drawer, List,
  ListItem, ListItemButton, ListItemText, IconButton, Collapse
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { useRouter } from 'next/navigation';
import { menu } from '@/config/menu';
import { useTheme } from "@mui/material/styles";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { useThemeMode } from "@/components/Layout/ThemeRegistry";
import NamespaceSelector from './NamespaceSelector';
import UserMenu from './UserMenu';

const drawerWidth = 220;

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const { mode, setMode } = useThemeMode();

  const [open, setOpen] = React.useState<Record<string, boolean>>({});

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const handleClick = (label: string) => {
    setOpen((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const drawer = (
    <div>
      <Toolbar />
      <List>
        {menu.map((group) => (
          <React.Fragment key={group.name}>
            <ListItem disablePadding>
              <ListItemButton onClick={() =>group.items ? handleClick(group.name) : router.push(group.link!)
        }
        >
                <ListItemText primary={group.name} />
                {group.items ? (open[group.name] ? <ExpandLess /> : <ExpandMore />) : null}
              </ListItemButton>
            </ListItem>
            {group.items && (
              <Collapse in={open[group.name]} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {group.items.map((child) => (
                    <ListItemButton
                      key={child.name}
                      sx={{ pl: 4 }}
                      onClick={() => router.push(child.link!)}
                    >
                      <ListItemText primary={child.name} />
                    </ListItemButton>
                  ))}
                </List>
              </Collapse>
            )}
          </React.Fragment>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2, display: { sm: "none" } }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
            KubeEdge Dashboard
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, ml: 'auto' }}>
            <NamespaceSelector />
            <UserMenu />
            <IconButton
              color="inherit"
              onClick={() => setMode(mode === "light" ? "dark" : "light")}
            >
              {mode === "light" ? <Brightness4Icon /> : <Brightness7Icon />}
            </IconButton>
          </Box>

        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>

        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
        <Box
        component="main"
        sx={{
            flexGrow: 1,
            minHeight: '100vh',
            bgcolor: (theme) => theme.palette.background.default,
        }}
        >
        <Toolbar />
        {children}
        </Box>
    </Box>
  );
}
