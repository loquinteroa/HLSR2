import { useNavigate } from "react-router-dom";
import { useAuth } from '../../../../contexts/AuthContext';
import {
  Avatar,
  Box,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography
} from '@mui/material';
import { NavLink } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { FC } from 'react';

const ListWrapper = styled(Box)(
  ({ theme }) => `
        .MuiTouchRipple-root {
            display: none;
        }
        
        .MuiListItem-root {
            transition: ${theme.transitions.create(['color', 'fill'])};
            
            &.MuiListItem-indicators {
                padding: ${theme.spacing(1, 2)};
                .MuiListItemText-root {
                    .MuiTypography-root {
                        &:before {
                            height: 4px;
                            width: 22px;
                            opacity: 0;
                            visibility: hidden;
                            display: block;
                            position: absolute;
                            bottom: -10px;
                            transition: all .2s;
                            border-radius: ${theme.general.borderRadiusLg};
                            content: "";
                            background: ${theme.colors.primary.main};
                        }
                    }
                }

                &.active,
                &:active,
                &:hover {
                
                    background: transparent;
                
                    .MuiListItemText-root {
                        .MuiTypography-root {
                            &:before {
                                opacity: 100;
                                visibility: visible;
                                font-size: 18px;
                                bottom: 0px;
                            }
                        }
                    }
                }
            }
        }
`
);

interface HeaderMenuProps {
  role?: string;
}

const HeaderMenu: FC<HeaderMenuProps> = ({
  role = ''
}) => {
  let navigate = useNavigate();
  const { userRole } = useAuth();
  const handleClick = () =>{
    let path = `/home`;
    navigate(path);
  }
  

  function AdminListItem() {
    if(role === "System Admin")
    return (
      <ListItem
          classes={{ root: 'MuiListItem-indicators' }}
          button
          component={NavLink}
          to="/admin"
        >
        <ListItemText
          primaryTypographyProps={{ noWrap: true, fontSize: 14 }}
          primary="ADMIN"
        />
      </ListItem>
    );
    else{
      <></>
    }
  }
  return (
    <>
      <Grid
        container
        justifyContent="space-between"
        alignItems="right"
      >
        <Grid item>
        <Box
        component={Grid}
        item
        xs={3}
        display={{ xs: "none", lg: "block" }}>
          <IconButton onClick={handleClick}><Avatar variant="rounded" alt="HLSR" src="/images/shiftboard.png" /></IconButton>
        </Box>
        </Grid>
        <Grid item>
          <Typography variant="h3" component="h3" className="mainTitle">
          &nbsp;&nbsp;ITC Shift Manager
          </Typography>
        </Grid>
      </Grid>
        <ListWrapper
          sx={{
            display: {
              xs: 'none',
              md: 'block'
            }
          }}
        >
        <Grid
          container
          justifyContent="space-between"
          alignItems="right"
        >
          <Grid item>
            <List disablePadding component={Box} display="flex">
              <ListItem
                classes={{ root: 'MuiListItem-indicators' }}
                button
                component={NavLink}
                to="/home"
              >
                <ListItemText
                  primaryTypographyProps={{ noWrap: true, fontSize: 14 }}
                  primary="DAILY SHIFTS"
                />
              </ListItem>
              {userRole !== "Basic" && (
                <ListItem
                  classes={{ root: 'MuiListItem-indicators' }}
                  button
                  component={NavLink}
                  to="/volunteer-shifts"
                >
                  <ListItemText
                    primaryTypographyProps={{ noWrap: true, fontSize: 14 }}
                    primary="VOLUNTEER SHIFTS"
                  />
                </ListItem>
              )}
              {userRole !== "Basic" && userRole !== "Committeeman" && (
                <ListItem
                  classes={{ root: 'MuiListItem-indicators' }}
                  button
                  component={NavLink}
                  to="/roster"
                >
                  <ListItemText
                    primaryTypographyProps={{ noWrap: true, fontSize: 14 }}
                    primary="ITC ROSTER"
                  />
                </ListItem>
              )}
              {AdminListItem()}
              {userRole === "Admin" && (
                <ListItem
                  classes={{ root: 'MuiListItem-indicators' }}
                  button
                  component={NavLink}
                  to="/registered-users"
                >
                  <ListItemText
                    primaryTypographyProps={{ noWrap: true, fontSize: 14 }}
                    primary="REGISTERED USERS"
                  />
                </ListItem>
              )}
              <ListItem
                classes={{ root: 'MuiListItem-indicators' }}
                button
                component={NavLink}
                to="/logout"
              >
                <ListItemText
                  primaryTypographyProps={{ noWrap: true, fontSize: 14 }}
                  primary="LOGOUT" 
                />
              </ListItem>
            </List>
          </Grid>
        </Grid>
      </ListWrapper>
    </>
  );
}
export default HeaderMenu;