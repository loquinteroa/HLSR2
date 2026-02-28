import {
  Container,
  Grid,
  Card,
  CardContent,
  Divider
} from '@mui/material';
import { styled } from '@mui/material/styles';

import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import './../../../index.css';

const MainContent = styled(Box)(
  () => `
    height: 100%;
    display: flex;
    flex: 1;
    overflow: auto;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`
);

function Status401() {

  return (
    <>
    <MainContent>    
      <Container maxWidth="md" className='errorCard'>
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={100}
        >
          <Grid item xs={12}>
            <Box>
              <Card>
                <CardContent>
                  <Grid id="top-row" container>
                    <Grid item xs={2} sm={0.8} lg={0.8}>
                      <Avatar variant="rounded" alt="HLSR Shiftboard Reports" src="/images/hlsrlogo.png"  className="statusPagesAvatar" />
                    </Grid>
                    <Grid item xs={10}>
                      <Typography variant="h5" component="h5">ITC Shift Manager</Typography>
                    </Grid>
                  </Grid>
                  <Divider className="statusPagesDivider"></Divider>
                  <Typography gutterBottom fontSize={60} align="center">401</Typography>
                  <Typography align="center" fontSize={20}>
                    You are not authorized to perform this operation.
                  </Typography>
                  <Typography variant="h3" sx={{ my: 2 }} align="center">
                    <Button href="/home" variant="outlined" sx={{ ml: 1 }}>Go back</Button>
                   </Typography>
                </CardContent>
              </Card>
            </Box>
          </Grid>
        </Grid>
      </Container>
      </MainContent>
    </>
  );
}

export default Status401;
