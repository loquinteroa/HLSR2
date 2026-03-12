import { Container, Grid, Card, CardContent } from '@mui/material';
import { ShiftsReport } from '../../components/reports/ShiftsReport';
import '../../index.css';

function ShiftsReportPage() {
  return (
    <>
      <Container className="pageMargin">
        <Grid container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
          <Grid item xs={12}>
            <Card className='pageCard'>
              <CardContent>
                <ShiftsReport />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

export default ShiftsReportPage;
