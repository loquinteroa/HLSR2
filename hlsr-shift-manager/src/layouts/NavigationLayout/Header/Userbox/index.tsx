import { FC } from 'react';
import PropTypes from 'prop-types';
import {
  Avatar,
  Box,
  Grid,
  Hidden,
  lighten,
  StepLabel,
  Typography
} from '@mui/material';
import '../../../../index.css';

import { styled } from '@mui/material/styles';

const UserBoxButton = styled(StepLabel)(
  ({ theme }) => `
        padding-left: ${theme.spacing(1)};
        padding-right: ${theme.spacing(1)};
        background-color: transparent;
`
);

const UserBoxText = styled(Box)(
  ({ theme }) => `
        text-align: left;
        padding-left: ${theme.spacing(1)};
`
);

const UserBoxLabel = styled(Typography)(
  ({ theme }) => `
        font-weight: ${theme.typography.fontWeightBold};
        color: ${theme.palette.secondary.main};
        display: block;
`
);

const UserBoxDescription = styled(Typography)(
  ({ theme }) => `
        color: ${lighten(theme.palette.secondary.main, 0.3)}
`
);

interface HeaderUserboxProps {
  userName?: string;
  role?: string;
  claimRole?: string;
}

const HeaderUserbox: FC<HeaderUserboxProps> = ({
  userName = '',
  role = '',
  claimRole = ''
}) => {

  if(role === "User") role = "";
  return (
    <>
      <UserBoxButton color="secondary">
        <Hidden mdDown>
          <UserBoxText>
            <UserBoxLabel variant="body1">{userName}</UserBoxLabel>
            <UserBoxDescription variant="body2">{role}</UserBoxDescription>
          </UserBoxText>
        </Hidden>
      </UserBoxButton>
      {(claimRole === "Admin" || claimRole === "Leadership") && (
        <Hidden mdDown>
          <Typography
            variant="body2"
            sx={{ mr: 1, fontWeight: 'bold', color: 'secondary.main' }}
          >
            {claimRole}
          </Typography>
        </Hidden>
      )}
      <Grid item>
        <Box
          component={Grid}
          item
          xs={3}
          display={{ xs: "none", lg: "block" }}>
          <Avatar variant="rounded" alt="HLSR" src="/images/howdy.png" className="userAvatar" />
        </Box>
      </Grid>
    </>
  );
}

HeaderUserbox.propTypes = {
  userName: PropTypes.string,
  role: PropTypes.string,
  claimRole: PropTypes.string
};
export default HeaderUserbox;
