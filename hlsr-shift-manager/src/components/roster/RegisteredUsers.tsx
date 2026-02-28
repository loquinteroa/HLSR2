import { useEffect, useState } from 'react';
import { Grid, Typography, Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, RadioGroup, FormControlLabel, Radio, FormLabel, Alert, InputAdornment, IconButton } from '@mui/material';
import { Autocomplete, Skeleton, Stack } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import DataTable from 'react-data-table-component';
import { getFunctions, httpsCallable } from 'firebase/functions';
import app from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';
import HLSRSBService from '../../api/HLSRSBService';
import AppSettingsService from '../../api/AppSettingsService';
import { Account } from '../../types/account';
import '../links/LinkItem.css';

interface FirebaseUser {
    displayName: string;
    email: string;
    role: string;
}

const firebaseFunctions = getFunctions(app!);

const passwordRules = /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

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

export const RegisteredUsers: React.FC = () => {
    const { grantUserRole } = useAuth()
    const [users, setUsers] = useState<FirebaseUser[]>([])
    const [filteredUsers, setFilteredUsers] = useState<FirebaseUser[]>([])
    const [search, setSearch] = useState("")
    const [reportTitle, setReportTitle] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    // Role dialog
    const [roleDialogOpen, setRoleDialogOpen] = useState(false)
    const [roleDialogUser, setRoleDialogUser] = useState<FirebaseUser | null>(null)
    const [selectedRole, setSelectedRole] = useState("None")
    const [editedDisplayName, setEditedDisplayName] = useState("")
    const [roleError, setRoleError] = useState<string | null>(null)

    // Register dialog
    const [registerDialogOpen, setRegisterDialogOpen] = useState(false)
    const [members, setMembers] = useState<Account[]>([])
    const [isLoadingMembers, setIsLoadingMembers] = useState(false)
    const [selectedMember, setSelectedMember] = useState<Account | null>(null)
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [registerError, setRegisterError] = useState<string | null>(null)
    const [registerSuccess, setRegisterSuccess] = useState<string | null>(null)
    const [isRegistering, setIsRegistering] = useState(false)

    // Reset password dialog
    const [resetDialogOpen, setResetDialogOpen] = useState(false)
    const [resetDialogUser, setResetDialogUser] = useState<FirebaseUser | null>(null)
    const [resetPassword, setResetPassword] = useState("")
    const [showResetPassword, setShowResetPassword] = useState(false)
    const [resetError, setResetError] = useState<string | null>(null)
    const [resetSuccess, setResetSuccess] = useState<string | null>(null)
    const [isResetting, setIsResetting] = useState(false)

    // Delete user dialog
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [deleteDialogUser, setDeleteDialogUser] = useState<FirebaseUser | null>(null)
    const [deleteError, setDeleteError] = useState<string | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)

    const passwordError = password.length > 0 && !passwordRules.test(password)
        ? "Password must be at least 8 characters with at least one uppercase and one lowercase letter."
        : null

    const resetPasswordError = resetPassword.length > 0 && !passwordRules.test(resetPassword)
        ? "Password must be at least 8 characters with at least one uppercase and one lowercase letter."
        : null

    useEffect(() => {
        loadUsers()
    }, [])

    const loadUsers = () => {
        setIsLoading(true)
        const getUsers = httpsCallable(firebaseFunctions, 'getRegisteredUsers')
        getUsers()
            .then((result: any) => {
                const userList: FirebaseUser[] = result.data?.users || []
                setUsers(userList)
                setFilteredUsers(userList)
                setReportTitle(`Registered Users (${userList.length})`)
            })
            .catch((err: any) => {
                console.error("Error loading registered users:", err)
                setUsers([])
                setFilteredUsers([])
            })
            .finally(() => setIsLoading(false))
    }

    const handleInputChange = (e: any) => {
        const newValue: string = e.target.value
        setSearch(newValue)
        if (newValue === "") {
            setFilteredUsers(users)
        } else {
            const filtered = users.filter((item: FirebaseUser) =>
                item.displayName.toLowerCase().includes(newValue.toLowerCase()) ||
                item.email.toLowerCase().includes(newValue.toLowerCase()) ||
                item.role.toLowerCase().includes(newValue.toLowerCase())
            )
            setFilteredUsers(filtered)
        }
    }

    // ── Role dialog ────────────────────────────────────────────────────────
    const handleSetRoleOpen = (user: FirebaseUser) => {
        setRoleDialogUser(user)
        setSelectedRole(user.role || "Basic")
        setEditedDisplayName(user.displayName)
        setRoleError(null)
        setRoleDialogOpen(true)
    }

    const handleRoleDialogClose = () => {
        setRoleDialogOpen(false)
        setRoleDialogUser(null)
    }

    const handleRoleSubmit = async () => {
        if (!roleDialogUser) return
        setRoleError(null)
        try {
            const role = selectedRole
            const nameChanged = editedDisplayName.trim() !== roleDialogUser.displayName
            const newDisplayName = editedDisplayName.trim() || roleDialogUser.displayName

            const ops: Promise<any>[] = [grantUserRole(roleDialogUser.email, role)]
            if (nameChanged && newDisplayName) {
                const updateName = httpsCallable(firebaseFunctions, 'updateUserDisplayName')
                ops.push(updateName({ email: roleDialogUser.email, displayName: newDisplayName }))
            }
            await Promise.all(ops)

            const updatedUsers = users.map(u =>
                u.email === roleDialogUser.email ? { ...u, role, displayName: newDisplayName } : u
            )
            setUsers(updatedUsers)
            setFilteredUsers(filteredUsers.map(u =>
                u.email === roleDialogUser.email ? { ...u, role, displayName: newDisplayName } : u
            ))
            handleRoleDialogClose()
        } catch (err: any) {
            setRoleError(err.message ?? "Failed to update user. Please try again.")
        }
    }

    // ── Reset password dialog ──────────────────────────────────────────────
    const handleResetOpen = (user: FirebaseUser) => {
        setResetDialogUser(user)
        setResetPassword("")
        setShowResetPassword(false)
        setResetError(null)
        setResetSuccess(null)
        setResetDialogOpen(true)
    }

    const handleResetClose = () => {
        setResetDialogOpen(false)
        setResetDialogUser(null)
    }

    const handleResetSubmit = async () => {
        if (!resetDialogUser || !resetPassword) return
        if (!passwordRules.test(resetPassword)) return
        setResetError(null)
        setResetSuccess(null)
        setIsResetting(true)
        try {
            const resetUserPassword = httpsCallable(firebaseFunctions, 'resetUserPassword')
            await resetUserPassword({ email: resetDialogUser.email, password: resetPassword })
            setResetSuccess("Password has been reset successfully.")
            setResetPassword("")
        } catch (err: any) {
            setResetError(err.message ?? "Failed to reset password.")
        } finally {
            setIsResetting(false)
        }
    }

    // ── Delete user dialog ─────────────────────────────────────────────────
    const handleDeleteOpen = (user: FirebaseUser) => {
        setDeleteDialogUser(user)
        setDeleteError(null)
        setDeleteDialogOpen(true)
    }

    const handleDeleteClose = () => {
        setDeleteDialogOpen(false)
        setDeleteDialogUser(null)
    }

    const handleDeleteSubmit = async () => {
        if (!deleteDialogUser) return
        setDeleteError(null)
        setIsDeleting(true)
        try {
            const deleteUser = httpsCallable(firebaseFunctions, 'deleteUser')
            await deleteUser({ email: deleteDialogUser.email })
            const updatedUsers = users.filter(u => u.email !== deleteDialogUser.email)
            setUsers(updatedUsers)
            setFilteredUsers(filteredUsers.filter(u => u.email !== deleteDialogUser.email))
            setReportTitle(`Registered Users (${updatedUsers.length})`)
            handleDeleteClose()
        } catch (err: any) {
            setDeleteError(err.message ?? "Failed to delete user.")
        } finally {
            setIsDeleting(false)
        }
    }

    // ── Register dialog ────────────────────────────────────────────────────
    const handleRegisterOpen = () => {
        setRegisterDialogOpen(true)
        setSelectedMember(null)
        setPassword("")
        setShowPassword(false)
        setRegisterError(null)
        setRegisterSuccess(null)

        if (members.length === 0) {
            setIsLoadingMembers(true)
            const appSettings = new AppSettingsService()
            const hlsrSBService = new HLSRSBService(appSettings)
            hlsrSBService.getCommitteeSetup("light")
                .then((response: any) => hlsrSBService.getCommitteeMembers(response.id))
                .then((membersResponse: any) => {
                    const list: Account[] = (membersResponse?.volunteers || []).sort(
                        (a: Account, b: Account) => a.screenName.localeCompare(b.screenName)
                    )
                    setMembers(list)
                })
                .catch((err: any) => console.error("Error loading members:", err))
                .finally(() => setIsLoadingMembers(false))
        }
    }

    const handleRegisterClose = () => {
        setRegisterDialogOpen(false)
    }

    const handleRegisterSubmit = async () => {
        if (!selectedMember || !password) return
        if (!passwordRules.test(password)) return
        setRegisterError(null)
        setRegisterSuccess(null)
        setIsRegistering(true)
        try {
            const registerUser = httpsCallable(firebaseFunctions, 'registerUser')
            await registerUser({
                email: selectedMember.email,
                password,
                displayName: selectedMember.screenName,
            })
            setRegisterSuccess(`${selectedMember.screenName} (${selectedMember.email}) has been registered.`)
            setSelectedMember(null)
            setPassword("")
            loadUsers()
        } catch (err: any) {
            setRegisterError(err.message ?? "Failed to register user.")
        } finally {
            setIsRegistering(false)
        }
    }

    // ── Table ──────────────────────────────────────────────────────────────
    const columns = [
        { id: 'name', name: 'Name', selector: (row: FirebaseUser) => row.displayName, grow: 3, sortable: true },
        { id: 'email', name: 'E-mail Address', selector: (row: FirebaseUser) => row.email, grow: 3, sortable: true },
        { id: 'role', name: 'Role', selector: (row: FirebaseUser) => row.role, grow: 2, sortable: true },
        {
            name: '',
            cell: (row: FirebaseUser) => (
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button variant="outlined" size="small" onClick={() => handleSetRoleOpen(row)}>
                        Set Role
                    </Button>
                    <Button variant="outlined" size="small" color="warning" onClick={() => handleResetOpen(row)}>
                        Reset Password
                    </Button>
                    <Button variant="outlined" size="small" color="error" onClick={() => handleDeleteOpen(row)}>
                        Remove
                    </Button>
                </Box>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            minWidth: '330px',
        }
    ]

    const customStyles = {
        rows: { style: { minHeight: '72px' } },
        headCells: {
            style: {
                paddingLeft: '8px', paddingRight: '8px',
                backgroundColor: "#f1f1f1", fontSize: "13px",
                fontWeight: "bold", color: "#686565"
            },
        },
        cells: { style: { paddingLeft: '8px', paddingRight: '8px', fontSize: "12px" } },
    }

    const DisplayGrid = (data: FirebaseUser[]) => {
        if (!isLoading) {
            if (data.length > 0)
                return (<DataTable responsive={true} columns={columns} data={data} striped dense customStyles={customStyles} defaultSortFieldId="name" />)
            else
                return (<span>No registered users found</span>)
        } else {
            return Progress()
        }
    }

    return (
        <Box style={{ marginTop: 5 }}>
            <Grid container justifyContent="center" marginTop={2} marginBottom={1}>
                <Grid item xs={12} md={10} justifyContent="center">
                    <Typography style={{ fontSize: 18, fontWeight: 'bold', color: 'maroon' }}>
                        {isLoading ? ProgressTitle() : reportTitle}
                    </Typography>
                </Grid>
            </Grid>
            <Grid container justifyContent="center" marginTop={1} marginBottom={1}>
                <Grid item xs={12} md={10}>
                    <Grid container justifyContent="space-between" alignItems="center" marginTop={1}>
                        <Grid item>
                            <Grid container alignItems="center" spacing={1}>
                                <Grid item><Typography style={{ fontSize: 13, fontWeight: 'bold' }}>Search: &nbsp;</Typography></Grid>
                                <Grid item><input value={search} onChange={handleInputChange} /></Grid>
                            </Grid>
                        </Grid>
                        <Grid item>
                            <Button variant="contained" size="small" onClick={handleRegisterOpen}>
                                Register User
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Grid container justifyContent="center">
                <Grid item xs={12} md={10}>
                    {DisplayGrid(filteredUsers)}
                </Grid>
            </Grid>

            {/* Set Role Dialog */}
            <Dialog open={roleDialogOpen} onClose={handleRoleDialogClose} fullWidth maxWidth="sm">
                <DialogTitle>Edit User</DialogTitle>
                <DialogContent>
                    {roleError && <Alert severity="error" sx={{ mb: 1 }}>{roleError}</Alert>}
                    <TextField
                        label="Name"
                        value={editedDisplayName}
                        onChange={(e) => setEditedDisplayName(e.target.value)}
                        fullWidth margin="normal" size="small"
                    />
                    <TextField
                        label="E-mail Address"
                        value={roleDialogUser?.email ?? ""}
                        InputProps={{ readOnly: true }}
                        fullWidth margin="normal" size="small"
                    />
                    <FormLabel component="legend" sx={{ mt: 2 }}>Role</FormLabel>
                    <RadioGroup value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)}>
                        <FormControlLabel value="Admin" control={<Radio />} label="Admin" />
                        <FormControlLabel value="Leadership" control={<Radio />} label="Leadership" />
                        <FormControlLabel value="Committeeman" control={<Radio />} label="Committeeman" />
                        <FormControlLabel value="Basic" control={<Radio />} label="Basic" />
                    </RadioGroup>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleRoleSubmit} variant="contained">Submit</Button>
                    <Button onClick={handleRoleDialogClose} variant="outlined">Cancel</Button>
                </DialogActions>
            </Dialog>

            {/* Reset Password Dialog */}
            <Dialog open={resetDialogOpen} onClose={handleResetClose} fullWidth maxWidth="sm">
                <DialogTitle>Reset Password</DialogTitle>
                <DialogContent>
                    {resetError && <Alert severity="error" sx={{ mb: 1 }}>{resetError}</Alert>}
                    {resetSuccess && <Alert severity="success" sx={{ mb: 1 }}>{resetSuccess}</Alert>}
                    <TextField
                        label="Name"
                        value={resetDialogUser?.displayName ?? ""}
                        InputProps={{ readOnly: true }}
                        fullWidth margin="normal" size="small"
                    />
                    <TextField
                        label="E-mail Address"
                        value={resetDialogUser?.email ?? ""}
                        InputProps={{ readOnly: true }}
                        fullWidth margin="normal" size="small"
                    />
                    <TextField
                        label="New Password"
                        type={showResetPassword ? "text" : "password"}
                        value={resetPassword}
                        onChange={(e) => setResetPassword(e.target.value)}
                        fullWidth margin="normal" size="small"
                        error={!!resetPasswordError}
                        helperText={resetPasswordError ?? "Min. 8 characters, one uppercase and one lowercase letter."}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setShowResetPassword(p => !p)} edge="end" size="small">
                                        {showResetPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleResetSubmit}
                        variant="contained"
                        color="warning"
                        disabled={!resetPassword || !!resetPasswordError || isResetting}
                    >
                        {isResetting ? "Resetting..." : "Reset Password"}
                    </Button>
                    <Button onClick={handleResetClose} variant="outlined">Close</Button>
                </DialogActions>
            </Dialog>

            {/* Delete User Dialog */}
            <Dialog open={deleteDialogOpen} onClose={handleDeleteClose} fullWidth maxWidth="sm">
                <DialogTitle>Remove User from Firebase</DialogTitle>
                <DialogContent>
                    {deleteError && <Alert severity="error" sx={{ mb: 1 }}>{deleteError}</Alert>}
                    <Typography sx={{ mb: 2 }}>
                        Are you sure you want to permanently remove this user from Firebase Authentication?
                        This action cannot be undone.
                    </Typography>
                    <TextField
                        label="Name"
                        value={deleteDialogUser?.displayName ?? ""}
                        InputProps={{ readOnly: true }}
                        fullWidth margin="normal" size="small"
                    />
                    <TextField
                        label="E-mail Address"
                        value={deleteDialogUser?.email ?? ""}
                        InputProps={{ readOnly: true }}
                        fullWidth margin="normal" size="small"
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleDeleteSubmit}
                        variant="contained"
                        color="error"
                        disabled={isDeleting}
                    >
                        {isDeleting ? "Removing..." : "Remove User"}
                    </Button>
                    <Button onClick={handleDeleteClose} variant="outlined">Cancel</Button>
                </DialogActions>
            </Dialog>

            {/* Register User Dialog */}
            <Dialog open={registerDialogOpen} onClose={handleRegisterClose} fullWidth maxWidth="sm">
                <DialogTitle>Register User</DialogTitle>
                <DialogContent>
                    {registerError && <Alert severity="error" sx={{ mb: 2 }}>{registerError}</Alert>}
                    {registerSuccess && <Alert severity="success" sx={{ mb: 2 }}>{registerSuccess}</Alert>}
                    <Autocomplete
                        sx={{ mt: 1 }}
                        options={members}
                        loading={isLoadingMembers}
                        value={selectedMember}
                        onChange={(_e, value) => setSelectedMember(value)}
                        getOptionLabel={(option) => option.screenName ? `${option.screenName} (${option.email})` : ''}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        renderInput={(params) => (
                            <TextField {...params} label="Committee Member" placeholder="Select a member" size="small" />
                        )}
                    />
                    <TextField
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        fullWidth
                        margin="normal"
                        size="small"
                        error={!!passwordError}
                        helperText={passwordError ?? "Min. 8 characters, one uppercase and one lowercase letter."}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setShowPassword(p => !p)} edge="end" size="small">
                                        {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleRegisterSubmit}
                        variant="contained"
                        disabled={!selectedMember || !password || !!passwordError || isRegistering}
                    >
                        {isRegistering ? "Registering..." : "Register"}
                    </Button>
                    <Button onClick={handleRegisterClose} variant="outlined">Close</Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}
