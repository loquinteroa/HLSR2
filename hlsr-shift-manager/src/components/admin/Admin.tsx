import {
  Card,
  CardContent,
  Container,
  Grid,
} from '@mui/material';
import '../../index.css';
import { Skeleton, Stack } from '@mui/material';
import { MemberShifts } from './MemberShifts';

function Progress() {
  return (
    <>
      <Stack className="skeletonSearchStack">
        <Skeleton className="skeletonAdmin" variant='rounded' style={{ backgroundColor: '#e6f2ff' }} />
        <Skeleton className="skeletonAdmin" variant='rounded' animation="wave" />
        <Skeleton className="skeletonAdmin" variant='rounded' style={{ backgroundColor: '#fceae8' }} />
        <Skeleton className="skeletonAdmin" variant='rounded' />
        <Skeleton className="skeletonAdmin" variant='rounded' animation="wave" />
        <Skeleton className="skeletonAdmin" variant='rounded' />
        <Skeleton className="skeletonAdmin" variant='rounded' style={{ backgroundColor: '#fceae8' }} />
        <Skeleton className="skeletonAdmin" variant='rounded' animation="wave" />
        <Skeleton className="skeletonAdmin" variant='rounded' />
        <Skeleton className="skeletonAdmin" variant='rounded' animation="pulse" />
      </Stack>
    </>);
}

export const Admin: React.FC = () => {
  
  const data: any[] = []

  if (!data) return (
    <>
      <Container maxWidth="lg" className="pageMargin">
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
                { Progress() }
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );

  return (
    <>
      <Container maxWidth="lg" className="pageMargin">
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={ 3 }
        >
          <Grid item xs={ 12 }>
            <MemberShifts/>
          </Grid>
        </Grid>
      </Container>
    </>
  );

}