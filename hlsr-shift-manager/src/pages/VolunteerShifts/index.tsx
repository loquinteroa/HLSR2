import { Container, Grid, Card, CardContent } from '@mui/material';
import { VolunteerShifts } from '../../components/shifts/VolunteerShifts';
import '../../index.css';

function VolunteerShiftsPage() {
  return (
    <>
      <Container className="pageMargin">
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={3}
        >
          <Grid item xs={12}>
            <Card className='pageCard'>
              <CardContent>
                <VolunteerShifts />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

export default VolunteerShiftsPage;
