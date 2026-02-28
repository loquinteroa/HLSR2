import {
  Card,
  CardContent,
  Container,
  Grid,
} from '@mui/material';
import '../../index.css';
import { Admin } from "../../components/admin/Admin";

function AdminPage() { 
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
                <Admin />
              </CardContent>
            </Card>            
          </Grid>
        </Grid>
      </Container>     
    </>
  );
}

export default AdminPage;