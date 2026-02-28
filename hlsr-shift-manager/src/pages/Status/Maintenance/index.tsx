import {
  Container,
  Grid,
  Card,
  CardContent,
  Divider
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import '../../../index.css';

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

function Maintenance() {

  return (
    <>
    <MainContent>    
      <Container maxWidth="md">
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
                    <Grid item xs={1} spacing={0}>
                      <Avatar variant="rounded" alt="ITC Shift Manager" src="/images/hlsrlogo.png" className="statusPagesAvatar" />
                    </Grid>
                    <Grid item xs={2}>
                      <Typography variant="h2" component="h2">ITC Shift Manager</Typography>
                    </Grid>
                  </Grid>
                  <Divider className="maintenanceDivider"></Divider>
                  <Typography gutterBottom variant="h2"align="center">Maintenance</Typography>
                  <Typography variant="h3" color="text.secondary" align='center' fontWeight="normal" sx={{ mt: 4, mb: 2 }}>
                    The site is currently down for maintenance
                  </Typography>
                  <Typography variant="h3" color="text.secondary" align='center' fontWeight="normal" sx={{ mb: 4 }}>
                    We apologize for any inconveniences caused
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

export default Maintenance;
