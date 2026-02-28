import { useEffect, useState } from 'react';
import { Button, Grid, Typography, Box, Autocomplete, TextField } from '@mui/material';
import { Skeleton, Stack } from '@mui/material';
import { Shift } from './../../types/shift'
import '../links/LinkItem.css';
import DataTable from 'react-data-table-component';
import { Account } from "../../types/account";
import { Workgroup } from "../../types/workgroup";
import * as Utils from './../utils/common'
import { DateRangePicker } from 'rsuite';
import 'rsuite/DateRangePicker/styles/index.css';

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
/*
function ProgressTitle() {
    return (
    <>
        <Stack className="skeletonSearchStack">
        <Skeleton sx={{ height: 16, width: 400, margin: 2 }} animation="wave" variant="rectangular" />
        </Stack>
    </>);
}
*/

export const MemberShifts: React.FC = () => {
    const [members, setMembers] = useState(Array<Account>())
    const [shiftData, setShiftData] = useState(Array<Shift>())
    //const [committeesData, setCommitteesData] = useState(Array<Workgroup>())
    const [selectedCommittee, setSelectedCommittee] = useState({id: "508159", name: "Information Services - Showtime Support"} as Workgroup)
    const [selectedMember, setSelectedMember] = useState({id:"", screenName: ""} as Account)
    const [isLoading, setIsLoading] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    setMembers(Array<Account>())
    setSelectedCommittee({id: "508159", name: "Information Services - Showtime Support"} as Workgroup)

    //const appSettings = new AppSettingsService()
    
    useEffect(() => {
        //loadCommittees()
        //setSelectedCommittee({id: selectedCommittee.id} as Workgroup)
    }, []);

    //const loadCommittees = () => {
        //setIsLoading(true)
        /*const commsDataResp = sbService.getCommittees()
        commsDataResp.then((response: any) => {
            const committees: Array<Workgroup> = response
            setCommitteesData(committees)
            loadCommitteeMembers(selectedCommittee.id, selectedCommittee.name)
            setIsLoading(false)
        })*/
    //}
    /*
    const loadCommitteeMembers = ((workgroupId: string, workgroupName: string) => {
        setIsLoading(true)
        setMembers([])
        /*const membersResp = sbService.getCommitteeMembers(workgroupId)
        membersResp.then((response: any) => {
            localStorage.setItem("members", response)
            setMembers(response)
            setIsLoading(false)
        })

        const committeeInfoResp = sbService.getCommitteeInfo(workgroupId)
        committeeInfoResp.then((response: any) => {
            setSelectedCommittee({id: response.data.result.workgroup.id, name: response.data.result.workgroup.name} as Workgroup)
        })
        */
    //})
    
    const loadShifts = ((workgroupId: string, memberId: string, startDate: string, endDate: string) => {
        setIsLoading(true)
        setShiftData([])
        /*
        const shiftsResp = sbService.getMemberShifts(workgroupId, memberId, startDate, endDate)
        shiftsResp.then((response: Array<Shift>) => {
            setShiftData(response)
            setIsLoading(false)
        })
        */
    })
    /*
    const onAutocompleteCommitteeChange = (e: any, value: any) => {
        if(value && value.id && value.id !== ""){
            setSelectedCommittee({id: value.id, name: value.name} as Workgroup)
            setSelectedMember({id:"", screenName: ""} as Account)
            setMembers(Array<Account>())
            loadCommitteeMembers(value.id, value.name)
            setShiftData([])
        }
    }
    */

    const onAutocompleteVolunteerChange = (e: any, value: any) => {
        if(value && value.id && value.id !== ""){
            setSelectedMember(value)
            setShiftData([])
            checkIfButtonDisabled(selectedCommittee.id, value.id, startDate, endDate)
        }
    }
    
    const onDateRangePickerChanged = (value: any) => {
        if(value && value.length === 2){
            const newStartDate: string = Utils.getFormatedDate(value[0], "YYYY-MM-DDT09:00:00")
            const newEndDate: string = Utils.getFormatedDate(value[1], "YYYY-MM-DDT09:00:00")
            setStartDate(newStartDate)
            setEndDate(newEndDate)
            setShiftData([])
            checkIfButtonDisabled(selectedCommittee.id, selectedMember.id, newStartDate, newEndDate)
        }
    }

    const columns = [
        { name: 'Start Date', selector: (row:any)  => row.startDate},
        { name: 'Start Time', selector: (row:any)  => row.startTime},
        { name: 'End Date', selector: (row:any)  => row.endDate },
        { name: 'End Time', selector: (row:any)  => row.endTime },
        { name: 'Shift Role', selector: (row:any)  => row.roleName }
    ]

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
                backgroundColor: "#f1f1f1",
                fontSize: "13px",
                fontWeight: "bold",
                color: "#686565"
            },
        },
        cells: {
            style: {
                paddingLeft: '8px',
                paddingRight: '8px',
                fontSize: "12px"
            },
        },
    }

    const DisplayGrid = (data: Array<Shift>) => {
        if(!isLoading){            
            if(data.length > 0)
                return (<DataTable responsive={true} columns={columns} data={data} striped dense customStyles={customStyles} />)
            else
                return(<span></span>);
        }
        else
            return(Progress())
    }

    const checkIfButtonDisabled = (committeeId: string, memberId: string, startDt: string, endDt: string) => {
        if(committeeId !== "" && memberId !== "" && startDt !== "" && endDt !== ""){
            setButtonDisabled(false)
        }
    }

    const onClickSearchShifts = ((event: any) => {
        loadShifts(selectedCommittee.id, selectedMember.id, Utils.getAPIDateFromString(startDate), Utils.getAPIDateFromString(endDate))
    })

    return (
        <Box style={{marginTop: 5}}>
            <Grid container justifyContent="center" spacing={1}>
                <Grid item xs={0} md={10}>
                    <Typography style={{fontSize: 18, fontWeight: 'bold', color: 'maroon'}}>Volunteer Shifts</Typography>
                </Grid>
            </Grid>
            <Grid container justifyContent="center" marginTop={1}>
                <Grid item xs={12} md={10}>
                    <Grid container justifyContent="left" marginTop={1}>
                        <Grid item style={{paddingTop: 8}} md={1.2} lg={1.2}>
                            <Typography style={{fontSize: 14, fontWeight: 'bold', color: 'navy'}}>Committee </Typography>
                        </Grid>
                        <Grid item style={{padding: 3}}>
                            {/*
                            <Autocomplete
                                sx={{ width: 340 }}
                                id="disable-close-on-select"
                                value={selectedCommittee}
                                options ={(committeesData || []).sort((a, b) => -b.name.localeCompare(a.name))}
                                isOptionEqualToValue={(option: Workgroup, value:Workgroup) => value === undefined || option?.id?.toString() === (value?.id ?? value)?.toString()}
                                onChange={onAutocompleteCommitteeChange}
                                getOptionLabel={(option) => (option.name ? option.name : '') }
                                renderInput={(committeeId) => (
                                <TextField {...committeeId} placeholder="Select committee" size="small" />
                                )}
                            />
                                */}
                        </Grid>
                    
                        <Grid item style={{paddingTop: 8, paddingLeft: 10}} md={1.2} lg={1.2}>
                            <Typography style={{fontSize: 14, fontWeight: 'bold', color: 'navy'}}>Volunteer</Typography>
                        </Grid>
                        <Grid item style={{padding: 3}}>
                            <Autocomplete
                                sx={{ width: 340 }}
                                id="disable-close-on-select"
                                value={selectedMember}
                                options ={(members || []).sort((a, b) => -b.screenName.localeCompare(a.screenName))}
                                isOptionEqualToValue={(option:Account, value:Account) => value === undefined || value.id === "" || option.id === value.id}
                                onChange={onAutocompleteVolunteerChange}
                                getOptionLabel={(option) => (option.screenName ? option.screenName : '') }
                                renderInput={(memberId) => (
                                <TextField {...memberId} placeholder="Select a volunteer" size="small" />
                                )}
                            />
                        </Grid>
                    </Grid>
                    <Grid container justifyContent="left" marginBottom={1}>
                        <Grid item style={{paddingTop: 8}} md={1.2} lg={1.2}>
                            <Typography style={{fontSize: 14, fontWeight: 'bold', color: 'navy'}}>Shift Dates</Typography>
                        </Grid>
                        <Grid item style={{padding: 3}}>
                            <DateRangePicker  format="MM/dd/yyyy" character=" - " onChange={onDateRangePickerChanged}/>
                        </Grid>
                        <Grid item style={{paddingTop: 8}} md={3} lg={3} marginLeft={2} >
                            <Button variant="contained" size="small" style={{padding: 6, paddingLeft:10, paddingRight: 10 }} onClick={onClickSearchShifts} disabled={buttonDisabled}>Search Shifts</Button>
                        </Grid>
                       
                    </Grid>
                </Grid>
            </Grid>
            <Grid container justifyContent="center">
                <Grid item xs={12} md={10}>
                    { DisplayGrid(shiftData) }
                </Grid>
            </Grid>
        </Box>
    );
}