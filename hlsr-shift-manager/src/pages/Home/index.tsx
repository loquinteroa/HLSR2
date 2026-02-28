import {
  Container,
  Card,
  CardContent,
  Grid
} from '@mui/material';
import '../../index.css';

// Firebase user is available via useAuth() – no side-effect call needed here.

function HomePage() {    
  return (
    <>
      <Container className="pageMargin">  
        <Grid container direction="row" justifyContent="center" alignItems="stretch" spacing={3} >
          <Grid item xs={12} md={6} xl={6} >
            <Card className="stickyForm">
              <CardContent>
                
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6} xl={6} style={{paddingTop: '1.3rem'}}>
            <Card>
              <CardContent>
                
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

export default HomePage;