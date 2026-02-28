import { useContext, useRef, useState } from 'react';
import {
  Box,
  alpha,
  Stack,
  lighten,
  Divider,
  IconButton,
  Tooltip,
  styled,
  useTheme,
  Menu,
  MenuItem,
  Popover
} from '@mui/material';
import MenuTwoToneIcon from '@mui/icons-material/MenuTwoTone';
import { NavigationContext } from '../../../contexts/NavigationContext';
import CloseTwoToneIcon from '@mui/icons-material/CloseTwoTone';
import HeaderUserbox from './Userbox';
import HeaderMenu from './Menu';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';

const HeaderWrapper = styled(Box)(
  ({ theme }) => `
        height: ${theme.header.height};
        color: ${theme.header.textColor};
        padding: ${theme.spacing(0, 2)};
        right: 0;
        z-index: 6;
        background-color: ${theme.header.background};
        backdrop-filter: blur(3px);
        position: fixed;
        justify-content: space-between;
        width: 100%;
        @media (min-width: ${theme.breakpoints.values.lg}px) {
            left: ${theme.sidebar.width};
            width: auto;
        }
`
);

function Header() {
  const ref = useRef<any>(null);
  const [isOpen, setOpen] = useState<boolean>(false);

  const { navigationToggle, toggleNavigation } = useContext(NavigationContext);
  const theme = useTheme();
  const navigate = useNavigate();
  const { logout, userRole } = useAuth();
  const currentUser = localStorage.getItem("currentUser") ? localStorage.getItem("currentUser")?.toString() : "";
  const currentRole = localStorage.getItem("currentRole") ? localStorage.getItem("currentRole")?.toString() : "";

  const handleSignOut = async (): Promise<void> => {
    try {
      await logout();
      localStorage.removeItem("currentUser");
      localStorage.removeItem("currentRole");
      navigate("/login");
    } catch (err) {
      console.error("Sign-out failed", err);
    }
  };
  const handleOpen = (): void => {
    setOpen(true);
    toggleNavigation();
  };

  const handleClose = (): void => {
    setOpen(false);
    toggleNavigation();
  };

  function AdminMenuOption() {
    if(currentRole === "System Admin")
    return (
      <MenuItem sx={{ px: 3 }} component={NavLink} to="/admin" onClick={handleClose}>
      ADMIN
    </MenuItem>);
    else{
      <></>
    }
 }
   return (
    <HeaderWrapper
      display="flex"
      alignItems="center"
      sx={{
        boxShadow:
          theme.palette.mode === 'dark'
            ? `0 1px 0 ${alpha(
                lighten(theme.colors.primary.main, 0.7),
                0.15
              )}, 0px 2px 8px -3px rgba(0, 0, 0, 0.2), 0px 5px 22px -4px rgba(0, 0, 0, .1)`
            : `0px 2px 8px -3px ${alpha(
                theme.colors.alpha.black[100],
                0.2
              )}, 0px 5px 22px -4px ${alpha(
                theme.colors.alpha.black[100],
                0.1
              )}`
      }}
    >
      <Stack
        direction="row"
        divider={<Divider orientation="vertical" flexItem />}
        alignItems="center"
        spacing={2}
      >
        <HeaderMenu role={currentRole} />
      </Stack>
      <Box display="flex" alignItems="center">
        <HeaderUserbox userName={currentUser?.toString()} role={currentRole} claimRole={userRole}></HeaderUserbox>
        <Box
          component="span"
          sx={{
            ml: 2,
            display: { lg: 'none', sm: 'inline-block', xs: 'inline-block' }
          }}
        >
          <Tooltip arrow title="Toggle Menu">
            <IconButton color="primary" ref={ref} onClick={handleOpen}>
              {!navigationToggle ? (
                <MenuTwoToneIcon fontSize="small"></MenuTwoToneIcon>
              ) : (
                <CloseTwoToneIcon fontSize="small" />
              )}
            </IconButton>
          </Tooltip>
          <Popover
            anchorEl={ref.current}
            onClose={handleClose}
            open={isOpen}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center'
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right'
            }}
          >
            <Box flex="1">
            <Menu anchorEl={ref.current} onClose={handleClose} open={isOpen}>
            <MenuItem sx={{ px: 3 }} component={NavLink} to="/home" onClick={handleClose}>
              DAILY SHIFTS
            </MenuItem>
            {userRole !== "Basic" && (
              <MenuItem sx={{ px: 3 }} component={NavLink} to="/volunteer-shifts" onClick={handleClose}>
                VOLUNTEER SHIFTS
              </MenuItem>
            )}
            {userRole !== "Basic" && userRole !== "Committeeman" && (
              <MenuItem sx={{ px: 3 }} component={NavLink} to="/roster" onClick={handleClose}>
                ITC ROSTER
              </MenuItem>
            )}
            {AdminMenuOption()}
            {userRole === "Admin" && (
              <MenuItem sx={{ px: 3 }} component={NavLink} to="/registered-users" onClick={handleClose}>
                REGISTERED USERS
              </MenuItem>
            )}
            <MenuItem sx={{ px: 3 }} component={NavLink} to="/logout" onClick={handleClose}>
              LOGOUT
            </MenuItem>
            <MenuItem sx={{ px: 3 }} onClick={() => { handleClose(); handleSignOut(); }}>
              SIGN OUT
            </MenuItem>
          </Menu>
            </Box>
          </Popover>
        </Box>
      </Box>
    </HeaderWrapper>
  );
}

export default Header;
