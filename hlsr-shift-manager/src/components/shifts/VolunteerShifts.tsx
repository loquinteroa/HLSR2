import { useEffect, useState } from 'react';
import { Grid, Typography, Box } from '@mui/material';
import { Autocomplete, TextField } from '@mui/material';
import { Skeleton, Stack } from '@mui/material';
import DataTable from 'react-data-table-component';
import HLSRSBService from '../../api/HLSRSBService';
import AppSettingsService from '../../api/AppSettingsService';
import { Account } from '../../types/account';
import { Shift } from '../../types/shift';
import { useAuth } from '../../contexts/AuthContext';
import '../links/LinkItem.css';

const getShiftHours = (shift: Shift) => {
  const start = new Date((shift as any).startDateTime);
  const end = new Date((shift as any).endDateTime);
  const diffMs = end.getTime() - start.getTime();
  return diffMs > 0 ? diffMs / (1000 * 60 * 60) : 0;
};

const formatHours = (hours: number) => `${hours.toFixed(2)}`;

const totalHours = (shifts: Shift[] = []) =>
  shifts.reduce((sum, s) => sum + getShiftHours(s), 0);

function Progress() {
    return (
    <>
        <Stack className="skeletonSearchStack">
        <Skeleton className="skeletonAdmin" variant='rounded' style={{ backgroundColor: '#e6f2ff' }} />
        <Skeleton className="skeletonAdmin" variant='rounded' animation="wave" />
        <Skeleton className="skeletonAdmin" variant='rounded' />
        <Skeleton className="skeletonAdmin" variant='rounded' animation="wave" />
        <Skeleton className="skeletonAdmin" variant='rounded' style={{ backgroundColor: '#e6f2ff' }} />
        <Skeleton className="skeletonAdmin" variant='rounded' animation="wave" />
        <Skeleton className="skeletonAdmin" variant='rounded' />
        <Skeleton className="skeletonAdmin" variant='rounded' animation="wave" />
        <Skeleton className="skeletonAdmin" variant='rounded' style={{ backgroundColor: '#e6f2ff' }} />
        <Skeleton className="skeletonAdmin" variant='rounded' animation="wave" />
        <Skeleton className="skeletonAdmin" variant='rounded' />
        <Skeleton className="skeletonAdmin" variant='rounded' animation="wave" />
        <Skeleton className="skeletonAdmin" variant='rounded' style={{ backgroundColor: '#e6f2ff' }} />
        <Skeleton className="skeletonAdmin" variant='rounded' animation="wave" />
        <Skeleton className="skeletonAdmin" variant='rounded' />
        <Skeleton className="skeletonAdmin" variant='rounded' animation="wave" />
        <Skeleton className="skeletonAdmin" variant='rounded' style={{ backgroundColor: '#e6f2ff' }} />
        </Stack>
    </>);
}

export const VolunteerShifts: React.FC = () => {
    const { currentUser, userRole } = useAuth();
    const [members, setMembers] = useState<Account[]>([]);
    const [selectedMember, setSelectedMember] = useState<Account | null>(null);
    const [shiftData, setShiftData] = useState<Shift[]>([]);
    const [committeeId, setCommitteeId] = useState('');
    const [isLoadingMembers, setIsLoadingMembers] = useState(false);
    const [isLoadingShifts, setIsLoadingShifts] = useState(false);
    const [reportTitle, setReportTitle] = useState('Volunteer Shifts');

    useEffect(() => {
        const appSettings = new AppSettingsService();
        const hlsrSBService = new HLSRSBService(appSettings);
        setIsLoadingMembers(true);
        hlsrSBService.getCommitteeSetup("light")
            .then((response: any) => {
                const id = response.id || appSettings.GetITCId();
                setCommitteeId(id);
                return hlsrSBService.getCommitteeMembers(id)
                    .then((membersResponse: any) => {
                        const membersList: Account[] = (membersResponse?.volunteers || []).sort(
                            (a: Account, b: Account) => a.screenName.localeCompare(b.screenName)
                        );
                        setMembers(membersList);
                        const match = membersList.find(
                            (m: Account) => m.email?.toLowerCase() === currentUser?.email?.toLowerCase()
                        );
                        if (match) {
                            setSelectedMember(match);
                            setReportTitle(`${match.screenName} — Shifts`);
                            loadShifts(match, id);
                        }
                    });
            })
            .catch((err: any) => {
                console.error('Error loading committee members:', err);
                setMembers([]);
            })
            .finally(() => setIsLoadingMembers(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const loadShifts = (member: Account, workgroupId: string) => {
        const appSettings = new AppSettingsService();
        const hlsrSBService = new HLSRSBService(appSettings);
        setIsLoadingShifts(true);
        setShiftData([]);
        const year = new Date().getFullYear();
        const startDate = `${year}-01-01`;
        const endDate = `${year}-12-31`;
        hlsrSBService.getVolunteerShifts(workgroupId, member.id, startDate, endDate)
            .then((response: any) => {
                const shifts: Shift[] = response?.shifts || response || [];
                setShiftData(shifts);
                setReportTitle(`${member.screenName} — ${shifts.length} Shift${shifts.length !== 1 ? 's' : ''}` + " (" + formatHours(totalHours(shifts)) + " hrs.)");
            })
            .catch((err: any) => {
                console.error('Error loading volunteer shifts:', err);
                setShiftData([]);
                setReportTitle(`${member.screenName} — Shifts`);
            })
            .finally(() => setIsLoadingShifts(false));
    };

    const onMemberChange = (_e: any, value: Account | null) => {
        setSelectedMember(value);
        setShiftData([]);
        if (value) {
            setReportTitle(`${value.screenName} — Shifts`);
            loadShifts(value, committeeId);
        } else {
            setReportTitle('Volunteer Shifts');
        }
    };

    const columns = [
        { name: 'Date', selector: (row: Shift) => row.startDate?.substring(0, 10), sortable: true, grow: 2 },
        { name: 'Start Time', selector: (row: Shift) => row.startTime, grow: 2 },
        { name: 'End Time', selector: (row: Shift) => row.endTime, grow: 2 },
        { name: 'Shift Hours', selector: (row: Shift) => formatHours(getShiftHours(row)), grow: 2 },
        { name: 'Shift Role', selector: (row: Shift) => row.roleName, grow: 3, sortable: true },
    ];

    const customStyles = {
        rows: {
            style: {
                minHeight: '72px',
            },
        },
        headCells: {
            style: {
                paddingLeft: '8px',
                paddingRight: '8px',
                backgroundColor: '#f1f1f1',
                fontSize: '13px',
                fontWeight: 'bold',
                color: '#686565',
            },
        },
        cells: {
            style: {
                paddingLeft: '8px',
                paddingRight: '8px',
                fontSize: '12px',
            },
        },
    };

    const DisplayGrid = () => {
        if (!selectedMember) return (<span></span>);
        if (isLoadingShifts) return Progress();
        if (shiftData.length > 0)
            return (<DataTable responsive={true} columns={columns} data={shiftData} striped dense customStyles={customStyles} />);
        return (<span>No shifts found</span>);
    };

    return (
        <Box style={{ marginTop: 5 }}>
            <Grid container justifyContent="center" marginTop={2} marginBottom={1}>
                <Grid item xs={12} md={10}>
                    <Typography style={{ fontSize: 18, fontWeight: 'bold', color: 'maroon' }}>
                        {reportTitle}
                    </Typography>
                </Grid>
            </Grid>
            <Grid container justifyContent="center" marginTop={1} marginBottom={2}>
                <Grid item xs={12} md={10}>
                    <Grid container alignItems="center" marginTop={1} spacing={2}>
                        <Grid item>
                            <Typography style={{ fontSize: 14, fontWeight: 'bold', color: 'navy' }}>
                                Committee Member
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Autocomplete
                                sx={{ width: 340 }}
                                options={members}
                                loading={isLoadingMembers}
                                value={selectedMember}
                                onChange={onMemberChange}
                                getOptionLabel={(option) => option.screenName ? `${option.screenName} (${option.email})` : ''}
                                isOptionEqualToValue={(option, value) => option.id === value.id}
                                disabled={userRole === "Committeeman"}
                                disableClearable={userRole === "Committeeman"}
                                renderInput={(params) => (
                                    <TextField {...params} placeholder="Select a committee member" size="small" />
                                )}
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Grid container justifyContent="center">
                <Grid item xs={12} md={10}>
                    {DisplayGrid()}
                </Grid>
            </Grid>
        </Box>
    );
};
