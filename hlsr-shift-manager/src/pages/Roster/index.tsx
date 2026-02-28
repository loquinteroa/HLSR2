import {
  Container,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import { ITCRoster } from '../../components/roster/ITCRoster';
import '../../index.css';

function SearchPage() {
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
                <ITCRoster />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>   
    </>
  );
}
export default SearchPage;