'use client'

import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Link from 'next/link';
import { Collapse } from '@mui/material';
import { ListItemProps } from '@mui/material/ListItem';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

const drawerWidth = 240;

export interface NavMenuItem {
  name?: string;
  link?: string;
  items?: NavMenuItem[];
}

interface SideNavProps {
  items?: NavMenuItem[];
}

interface ListItemLinkProps extends ListItemProps {
  open?: boolean;
  item?: NavMenuItem;
}

function ListItemLink(props: ListItemLinkProps) {
  let icon;
  if (props.item?.items && props.item.items.length > 0) {
    icon = props.open ? <ExpandLess /> : <ExpandMore />;
  }

  if (props.item?.link) {
    return (
      <Link href={props.item.link}>
        <ListItemText primary={props.item?.name} />
        {icon}
      </Link>
    );
  } else {
    return (
      <>
        <ListItemText primary={props.item?.name} />
        {icon}
      </>
    );
  }
}

export default function SideNav(props: SideNavProps) {
  const [expandedItems, setExpandedItems] = useState<number[]>([]);

  const toggleExpand = (index: number) => {
    setExpandedItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {props?.items?.map((item, index) => {
              let elem = [(
                <ListItem key={index} disablePadding>
                  <ListItemButton onClick={() => toggleExpand(index)}>
                    <ListItemLink item={item} open={expandedItems.includes(index)} />
                  </ListItemButton>
                </ListItem>
              )];

              if (item.items && item.items.length > 0) {
                elem.push((
                  <Collapse key={`${index}-sub`} component="li" in={expandedItems.includes(index)} timeout="auto" unmountOnExit>
                    <List disablePadding>
                      {item.items.map((subItem, subIndex) => (
                        <ListItem key={`${index}-${subIndex}`}>
                          <ListItemButton>
                            <ListItemLink item={subItem} />
                          </ListItemButton>
                        </ListItem>
                      ))}
                    </List>
                  </Collapse>
                ));
              }

              return elem;
            })}
          </List>
        </Box>
      </Drawer>
    </Box>
  );
}
