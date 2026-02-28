import {
  Container,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import { RegisteredUsers } from '../../components/roster/RegisteredUsers';
import '../../index.css';

function RegisteredUsersPage() {
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
                <RegisteredUsers />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

export default RegisteredUsersPage;
