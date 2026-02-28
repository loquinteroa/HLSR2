import { useEffect, useState, useCallback } from 'react';
import { Grid, Typography, Box } from '@mui/material';
import { Shift } from '../../types/shift'
import HLSRSBService from '../../api/HLSRSBService'
import AppSettingsService from "../../api/AppSettingsService";
import { Skeleton, Stack } from '@mui/material';
import '../links/LinkItem.css';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import DataTable from 'react-data-table-component';
import greenLight from '../../images/green_light.png'
import * as Utils from '../utils/common'
import { Workgroup } from "../../types/workgroup";

function Progress() {
    return (
    <>
        <Stack className="skeletonSearchStack">
        <Skeleton className="skeletonAdmin" variant='rounded' style={{ backgroundColor: '#e6f2ff' }} />
        <Skeleton className="skeletonAdmin" variant='rounded' animation="wave" />
        <Skeleton className="skeletonAdmin" variant='rounded' />
        <Skeleton className="skeletonAdmin" variant='rounded' animation="wave" />
        <Skeleton className="skeletonAdmin" variant='rounded' style={{ backgroundColor: '#e6f2ff' }} />
        </Stack>
    </>);
}

function ProgressTitle() {
    return (
    <>
        <Stack className="skeletonSearchStack">
        <Skeleton sx={{ height: 16, width: 700, margin: 2 }} animation="wave" variant="rectangular" />
        </Stack>
    </>);
}

export const DailyShifts: React.FC = () => {
    const appSettings = new AppSettingsService()
    const hlsrSBService = new HLSRSBService(appSettings)
    const [selectedCommittee, setSelectedCommittee] = useState({id:appSettings.GetITCId(), name: "Information Technology Commmittee"} as Workgroup)
    const [shiftData, setShiftData] = useState(Array<Shift>())
    const [isLoading, setIsLoading] = useState(false)
    const [shiftTitle, setShiftTitle] = useState("Information Technology Commmittee")
    const [shiftDate, setShiftDate] = useState(Utils.getFormatedDate(new Date(), "YYYY-MM-DDT09:00:00"))
    

    const refreshClockIn = async () => {
        setIsLoading(true)
        const strShifts: any = localStorage.getItem('shifts') === undefined ? "" : localStorage.getItem('shifts');
        try {
            const whosOn: string[] = await hlsrSBService.getWhosOn(selectedCommittee.id)
            let shifts = JSON.parse(strShifts?.toString() || '[]')
            
            if(!Array.isArray(shifts) || shifts.length === 0) {
                setIsLoading(false)
                return
            }

            shifts.forEach(function (shift: Shift){
                const memberIdStr = shift.memberId?.toString ? shift.memberId.toString() : String(shift.memberId || "")
                shift.onDuty = Array.isArray(whosOn) && whosOn.includes(memberIdStr)
            })
            
            setShiftData(shifts)
            localStorage.setItem("shifts", JSON.stringify(shifts))
            DisplayShowtimeGrid(shifts)
        } catch (error: any) {
            console.error("Error refreshing clock-in:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const loadCommitteeConfig = useCallback(() => {
        setIsLoading(true)
        const commSetupDataResp = hlsrSBService.getCommitteeSetup("light")
        commSetupDataResp.then((response: any) => {
            setSelectedCommittee({id: response.id, name: response.committeeName || ""} as Workgroup)
            setIsLoading(false)
        })
        .catch((error: any) => {
            console.error("Error loading committee setup:", error)
            setIsLoading(false)
        })
      }, [])

    const loadData = (startDate: string, committee: string) => {
        setIsLoading(true)
        const shiftListResp = hlsrSBService.getShiftList(committee, startDate, startDate)
        shiftListResp.then((response: any) => {
            if (response) {
                setShiftTitle(response.shiftTitle || "")
                setSelectedCommittee({id: response.workgroupId || committee, name: response.workgroupName || ""})
                setShiftData(response.shifts || [])
                localStorage.setItem("shifts", JSON.stringify(response.shifts || []))
            }
            setIsLoading(false)
        })
        .catch((error: any) => {
            console.error("Error loading shift data:", error)
            setShiftTitle("")
            setShiftData([])
            setIsLoading(false)
        })
    }

    useEffect(() => {
        const reportDate: string = Utils.getAPIDateFromString(shiftDate)
        loadCommitteeConfig()
        loadData(reportDate, selectedCommittee.id)
        
        const intervalId = setInterval(() => {
            refreshClockIn()
          }, 60000);
      
          return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedCommittee.id, shiftDate]); // Only include primitive dependencies

    const onCalendarChange = (e: any) => {
        setShiftData([])
        const changedDate = Utils.getAPIDateFromString(e)
        setShiftDate(Utils.getFormatedDate(e, "YYYY-MM-DDT09:00:00"))
        loadData(changedDate, selectedCommittee.id)        
    }

    const onAutocompleteChange = (e: any, value: any) => {
        if(value && value.id && value.id !== ""){
            setSelectedCommittee({id: value.id, name: value.name} as Workgroup)
            const reportDate = Utils.getAPIDateFromString(shiftDate)
            loadData(reportDate, value.id)
        }
    }

    const isOnDuty = (onDuty: boolean) => {
        if(onDuty){
            return <center><img alt="On Duty" src={greenLight} style={{width: 20}} /></center>
        }
        else{
            return <span></span>
        }        
    }

    const columns = [
        { name: 'Start Time', selector: (row:any) => row.startTime },
        { name: 'End Time', selector: (row:any)  => row.endTime },
        { name: 'Committee Person', selector: (row:any) => row.memberName },
        { name: 'Shift Role', selector: (row:any)  => row.roleName },
        { name: 'Clocked-In', selector: (row:any) => isOnDuty(row.onDuty) }
    ]

    const customStyles = {
        rows: {
            style: {
                minHeight: '72px', 
            },
        },
        headCells: {
            style: {
                paddingLeft: '4px',
                paddingRight: '4px',
                backgroundColor: "#f1f1f1",
                fontSize: "12px",
                fontWeight: "bold",
                color: "#686565"
            },
        },
        cells: {
            style: {
                paddingLeft: '4px',
                paddingRight: '4px',
                fontSize: "11px",
                paddingTop: "0px",
                paddingBottom: "0px",
            },
        },
    }

    const DisplayCaptainsGrid = (data: Array<Shift>) => {
        if(!isLoading){
            const captains = data.filter((item:Shift) => item.title.toLowerCase().includes('captain'))
            if(captains.length > 0)
                return (<DataTable responsive={true} columns={columns} data={captains} striped dense customStyles={customStyles} />)
            else
                return(<span>No volunteers</span>)
        }
        else
            return(Progress())
    }
    const DisplayShowtimeGrid = (data: Array<Shift>) => {
        if(!isLoading){
            const showtime = data.filter((item:Shift) => !item.title.toLowerCase().includes('captain') && !item.title.toLowerCase().includes('rookie'))
            if(showtime.length > 0)
                return (<DataTable responsive={true} columns={columns} data={showtime} striped dense customStyles={customStyles} />)
            else
                return(<span>No volunteers</span>);
        }
        else
            return(Progress())
    }
    const DisplayRookiesGrid = (data: Array<Shift>) => {
        if(!isLoading){
            const rookies = data.filter((item:Shift) => item.title.toLowerCase().includes('rookie'))
            if(rookies.length > 0)
                return (<DataTable responsive={true} columns={columns} data={rookies} striped dense customStyles={customStyles} />)
            else
                return(<span>No volunteers</span>);
        }
        else
            return(Progress())
    }

    const data: Array<Shift> = shiftData
    
    //const strShifts: any = localStorage.getItem('shifts') === undefined ? "" : localStorage.getItem('shifts')
    //let data:Array<Shift> = JSON.parse(strShifts?.toString())
    //console.log(shiftData)
    
    return (
        <Box style={{marginTop: 5}}>
            <Grid container justifyContent="center" spacing={1}>
                <Grid item xs={0} md={10}>
                    <Typography style={{fontSize: 18, fontWeight: 'bold', color: 'maroon'}}>{isLoading ? ProgressTitle() : shiftTitle}</Typography>
                </Grid>
            </Grid>
            <Grid container justifyContent="center" marginTop={1}>
                <Grid item xs={12} md={10}>
                    <Grid container justifyContent="left" marginTop={1} marginBottom={2}>
                        <Grid item style={{padding: 2}}>
                            <DatePicker className="calendar" label="Shift Date" closeOnSelect value={Date.parse(shiftDate)} onChange={(newValue) => onCalendarChange(newValue)} slotProps={{ textField: { size: 'small' } }} />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Grid container justifyContent="center" spacing={3}>
                <Grid item xs={11} md={10}>
                    <Typography variant={"h4"} paddingBottom={1} style={{fontWeight: 'bold', color: 'navy'}}>Captains</Typography>
                    { DisplayCaptainsGrid(data) }
                </Grid>
            </Grid>
            <Grid container justifyContent="center" marginTop={1} spacing={3}>
                <Grid item xs={11} md={10}>
                    <Typography variant={"h4"} paddingBottom={1} style={{fontWeight: 'bold', color: 'navy'}}>Showtime Support</Typography>
                    { DisplayShowtimeGrid(data) }
                </Grid>
            </Grid>
            <Grid container justifyContent="center" marginTop={1} spacing={3}>
                <Grid item xs={11} md={10}>
                    <Typography variant={"h4"} paddingBottom={1} style={{fontWeight: 'bold', color: 'navy'}}>Rookies</Typography>
                    { DisplayRookiesGrid(data) }
                </Grid>
            </Grid>
        </Box>
    );
}

