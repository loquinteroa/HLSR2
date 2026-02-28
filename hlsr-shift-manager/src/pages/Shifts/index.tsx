import {
  Card,
  CardContent,
  Container,
  Grid,
} from '@mui/material';
import '../../index.css';
import { DailyShifts } from "../../components/shifts/DailyShifts";

function DailyShiftsPage() { 
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
                <DailyShifts />
              </CardContent>
            </Card>            
          </Grid>
        </Grid>
      </Container>     
    </>
  );
}

export default DailyShiftsPage;