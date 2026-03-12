import { useState } from 'react';
import { Grid, Typography, Box, Button, useMediaQuery, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress } from '@mui/material';
import { Skeleton, Stack } from '@mui/material';
import HLSRSBService from '../../api/HLSRSBService';
import AppSettingsService from '../../api/AppSettingsService';
import { ActivityLogger } from '../../api/ActivityLogger';
import { auth } from '../../firebase';
import '../links/LinkItem.css';
import DataTable from 'react-data-table-component';
import { ShiftReportRow } from '../../types/shiftReport';
import { Shift } from '../../types/shift';

const getShiftHours = (shift: Shift) => {
    const start = new Date(shift.startDateTime as any);
    const end = new Date(shift.endDateTime as any);
    const diffMs = end.getTime() - start.getTime();
    return diffMs > 0 ? diffMs / (1000 * 60 * 60) : 0;
};

const formatHours = (hours: number) => hours.toFixed(2);

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

export const ShiftsReport: React.FC = () => {
    const appSettings = new AppSettingsService()
    const hlsrSBService = new HLSRSBService(appSettings)
    const isSmallScreen = useMediaQuery('(max-width:992px)')
    const [rows, setRows] = useState(Array<ShiftReportRow>())
    const [filteredRows, setFilteredRows] = useState(Array<ShiftReportRow>())
    const [search, setSearch] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [hasRun, setHasRun] = useState(false)
    const [committeeId, setCommitteeId] = useState("")

    // Modal state
    const [modalOpen, setModalOpen] = useState(false)
    const [modalTitle, setModalTitle] = useState("")
    const [modalShifts, setModalShifts] = useState<Shift[]>([])
    const [isLoadingModal, setIsLoadingModal] = useState(false)

    const runReport = () => {
        setIsLoading(true)
        setHasRun(true)

        hlsrSBService.getCommitteeSetup("light")
            .then((setupResponse: any) => setCommitteeId(setupResponse.id || appSettings.GetITCId()))
            .catch(() => {})

        hlsrSBService.getShiftsReport()
            .then((response: any) => {
                const data: ShiftReportRow[] = response || []
                setRows(data)
                setFilteredRows(data)
                ActivityLogger.logActivity("run_shifts_report", auth?.currentUser?.email || "", { count: data.length })
            })
            .catch((error: any) => {
                console.error("Error loading shifts report:", error)
                setRows([])
                setFilteredRows([])
            })
            .finally(() => setIsLoading(false))
    }

    const handleShiftsClick = (row: ShiftReportRow) => {
        if (!committeeId) return

        setModalTitle(`${row.screenName} — ${row.totalShifts} Shift${row.totalShifts !== 1 ? 's' : ''} (${Number(row.totalHours).toFixed(2)} hours)`)
        setModalShifts([])
        setModalOpen(true)
        setIsLoadingModal(true)

        const year = new Date().getFullYear()
        hlsrSBService.getVolunteerShifts(committeeId, row.id, `${year}-01-01`, `${year}-12-31`)
            .then((response: any) => {
                const shifts: Shift[] = (response?.Shifts || []).map((s: any) => ({
                    id: s.Id,
                    memberId: s.MemberId,
                    memberName: s.MemberName,
                    memberPhone: s.MemberPhone,
                    memberEmail: s.MemberEmail,
                    onDuty: s.OnDuty,
                    roleId: s.RoleId,
                    roleName: s.RoleName,
                    subject: s.Subject,
                    title: s.Title,
                    startDate: s.StartDate,
                    startTime: s.StartTime,
                    startDateTime: s.StartDateTime,
                    startDateSorting: s.StartDateTime,
                    endDate: s.EndDate,
                    endTime: s.EndTime,
                    endDateTime: s.EndDateTime,
                }))
                setModalShifts(shifts)
            })
            .catch((err: any) => {
                console.error("Error loading volunteer shifts:", err)
            })
            .finally(() => setIsLoadingModal(false))
    }

    const handleInputChange = (e: any) => {
        const newValue: string = e.target.value
        setSearch(newValue)
        if (newValue === "") {
            setFilteredRows(rows)
        } else {
            const lower = newValue.toLowerCase()
            setFilteredRows(rows.filter((item: ShiftReportRow) =>
                item.screenName.toLowerCase().includes(lower) ||
                item.title.toLowerCase().includes(lower) ||
                item.email.toLowerCase().includes(lower)
            ))
        }
    }

    const modalColumns = [
        { name: 'Date',        selector: (row: Shift) => row.startDate?.substring(0, 10), sortable: true, grow: 2 },
        { name: 'Start Time',  selector: (row: Shift) => row.startTime, grow: 2 },
        { name: 'End Time',    selector: (row: Shift) => row.endTime, grow: 2 },
        { name: 'Shift Hours', selector: (row: Shift) => formatHours(getShiftHours(row)), grow: 1 },
        { name: 'Subject',     selector: (row: Shift) => row.subject, grow: 3, sortable: true },
    ]

    const columns = [
        { name: 'Name',        selector: (row: ShiftReportRow) => row.screenName,  grow: 1, sortable: true },
        { name: 'Phone',       selector: (row: ShiftReportRow) => row.phone,       grow: 2, hide: 'lg' as any },
        { name: 'Email',       selector: (row: ShiftReportRow) => row.email,       grow: 3, hide: 'lg' as any },
        { name: 'Title',       selector: (row: ShiftReportRow) => row.title,       grow: 2, sortable: true, hide: 'lg' as any },
        {
            name: 'Shifts',
            width: isSmallScreen ? '65px' : '100px',
            right: true,
            sortable: true,
            selector: (row: ShiftReportRow) => row.totalShifts,
            cell: (row: ShiftReportRow) => (
                <span
                    style={{ color: '#1976d2', cursor: 'pointer', fontWeight: 'bold' }}
                    onClick={() => handleShiftsClick(row)}
                >
                    {row.totalShifts}
                </span>
            ),
        },
        { name: 'Total Hours', selector: (row: ShiftReportRow) => Number(row.totalHours).toFixed(2), width: isSmallScreen ? '100px' : '140px', right: true, sortable: true },
    ]

    const customStyles = {
        rows: {
            style: { minHeight: '56px' },
        },
        headCells: {
            style: {
                paddingLeft: '8px',
                paddingRight: '8px',
                backgroundColor: "#f1f1f1",
                fontSize: "13px",
                fontWeight: "bold",
                color: "#686565",
            },
        },
        cells: {
            style: {
                paddingLeft: '8px',
                paddingRight: '8px',
                fontSize: "12px",
            },
        },
    }

    const modalCustomStyles = {
        rows: { style: { minHeight: '48px' } },
        headCells: {
            style: {
                paddingLeft: '8px', paddingRight: '8px',
                backgroundColor: "#f1f1f1", fontSize: "12px",
                fontWeight: "bold", color: "#686565",
            },
        },
        cells: { style: { paddingLeft: '8px', paddingRight: '8px', fontSize: "12px" } },
    }

    const DisplayGrid = (data: Array<ShiftReportRow>) => {
        if (isLoading) return Progress()
        if (!hasRun) return <span></span>
        if (data.length > 0)
            return (<DataTable responsive={true} columns={columns} data={data} striped dense customStyles={customStyles} />)
        return <span>No data available</span>
    }

    return (
        <Box style={{ marginTop: 5 }}>
            <Grid container justifyContent="center" marginTop={2} marginBottom={1}>
                <Grid item xs={12} md={10}>
                    <Typography style={{ fontSize: 18, fontWeight: 'bold', color: 'maroon' }}>Shifts Report</Typography>
                </Grid>
            </Grid>
            <Grid container justifyContent="center" marginTop={1} marginBottom={1}>
                <Grid item xs={12} md={10}>
                    <Grid container justifyContent="left" alignItems="center" spacing={2} marginTop={1}>
                        <Grid item>
                            <Button
                                variant="contained"
                                size="small"
                                style={{ padding: 6, paddingLeft: 16, paddingRight: 16 }}
                                onClick={runReport}
                                disabled={isLoading}
                            >
                                Run Report
                            </Button>
                        </Grid>
                        <Grid item>
                            <Grid container alignItems="center" spacing={1}>
                                <Grid item>
                                    <Typography style={{ fontSize: 13, fontWeight: 'bold' }}>Search: &nbsp;</Typography>
                                </Grid>
                                <Grid item>
                                    <input value={search} onChange={handleInputChange} />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Grid container justifyContent="center">
                <Grid item xs={12} md={10}>
                    {DisplayGrid(filteredRows)}
                </Grid>
            </Grid>

            <Dialog open={modalOpen} onClose={() => setModalOpen(false)} fullWidth maxWidth="md">
                <DialogTitle style={{ fontWeight: 'bold', color: 'maroon' }}>{modalTitle}</DialogTitle>
                <DialogContent>
                    {isLoadingModal ? (
                        <Box display="flex" justifyContent="center" padding={4}>
                            <CircularProgress />
                        </Box>
                    ) : modalShifts.length > 0 ? (
                        <DataTable
                            responsive={true}
                            columns={modalColumns}
                            data={modalShifts}
                            striped
                            dense
                            customStyles={modalCustomStyles}
                        />
                    ) : (
                        <Typography>No shifts found.</Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" onClick={() => setModalOpen(false)}>Close</Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}
