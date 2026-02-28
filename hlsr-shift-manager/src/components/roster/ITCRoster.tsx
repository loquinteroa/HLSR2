import { useCallback, useEffect, useState } from 'react';
import { Grid, Typography, Box } from '@mui/material';
import { Skeleton, Stack } from '@mui/material';
import HLSRSBService from '../../api/HLSRSBService'
import AppSettingsService from "../../api/AppSettingsService";
import '../links/LinkItem.css';
import DataTable from 'react-data-table-component';
import { Account } from "../../types/account";

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

function ProgressTitle() {
    return (
    <>
        <Stack className="skeletonSearchStack">
        <Skeleton sx={{ height: 16, width: 400, margin: 2 }} animation="wave" variant="rectangular" />
        </Stack>
    </>);
}

export const ITCRoster: React.FC = () => {
    const appSettings = new AppSettingsService()
    const hlsrSBService = new HLSRSBService(appSettings)
    const [members, setMembers] = useState(Array<Account>())
    const [filteredMembers, setFilteredMembers] = useState(Array<Account>())
    const [search, setSearch] = useState("")
    const [reportTitle, setReportTitle] = useState("")
    const [isLoading, setIsLoading] = useState(false);

    const loadCommitteeConfig = useCallback(() => {
        setIsLoading(true)
        hlsrSBService.getCommitteeSetup("light")
            .then((response: any) => {
                setMembers([])

                return hlsrSBService.getCommitteeMembers(response.id)
                    .then((membersResponse: any) => {
                        const membersListTemp = membersResponse?.volunteers || []
                        const membersList = membersListTemp.sort((a: Account, b: Account) =>
                            a.screenName.localeCompare(b.screenName)
                        )
                        localStorage.setItem("members", JSON.stringify(membersList))
                        setMembers(membersList)
                        setFilteredMembers(membersList)
                        setReportTitle(response.committeeName + " Roster (" + membersList.length + ")")
                    })
            })
            .catch((error: any) => {
                console.error("Error loading committee:", error)
                setMembers([])
                setFilteredMembers([])
            })
            .finally(() => {
                setIsLoading(false)
            })
    }, [hlsrSBService])

    useEffect(() => {
        loadCommitteeConfig()
    }, []);

    const handleInputChange = (e: any) => {
        const newValue: string = e.target.value
        setSearch(newValue)
        if(e.target.value === ""){
            setFilteredMembers(members)
        }
        else{
            const filtered = members.filter((item:Account) => item.screenName.toLowerCase().includes(newValue.toLocaleLowerCase()) ||
                item.screenName.toLowerCase().includes(newValue.toLocaleLowerCase()) ||
                item.title.toLowerCase().includes(newValue.toLocaleLowerCase())
            )
            setFilteredMembers(filtered)
        }
    }

    const columns = [
        { name: 'Name', selector: (row: Account) => row.screenName, grow:3 },
        { name: 'E-mail Address', selector: (row: Account) => row.email, grow: 3 },
        { name: 'Title', selector: (row: Account) => row.title, grow: 3 },
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

    const DisplayGrid = (data: Array<Account>) => {
        if(!isLoading){
            if(data.length > 0)
                return (<DataTable responsive={true} columns={columns} data={data} striped dense customStyles={customStyles} />)
            else
                return(<span>No volunteers available</span>);
        }
        else
            return(Progress())
    }
    return (
        <Box style={{marginTop: 5}}>
            <Grid container justifyContent="center" marginTop={2} marginBottom={1}>
                <Grid item xs={12} md={10}
                    justifyContent="center">
                        <Typography style={{fontSize: 18, fontWeight: 'bold', color: 'maroon'}}>{isLoading ? ProgressTitle() : reportTitle}</Typography>
                </Grid>
            </Grid>
            <Grid container justifyContent="center" marginTop={1} marginBottom={1}>
                <Grid item xs={12} md={10}>
                    <Grid container justifyContent="left" marginTop={1}>
                        <Grid item><Typography style={{fontSize: 13, fontWeight: 'bold'}}>Search: &nbsp;</Typography></Grid>
                        <Grid item><input value={search} onChange={handleInputChange}/></Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Grid container justifyContent="center">
                <Grid item xs={12} md={10}>
                    { DisplayGrid(filteredMembers) }
                </Grid>
            </Grid>
        </Box>
    );
}
