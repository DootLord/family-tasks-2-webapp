import './App.css'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import TaskTable from './components/task-table';
import Snackbar from '@mui/material/Snackbar';
import React from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Dialog from '@mui/material/Dialog';
import UserChip from './components/user-chip';
import Container from '@mui/material/Container';
import { Breakpoint } from '@mui/material/styles';



function App() {
    let [snackbarOpen, setSnackbarOpen] = React.useState(false);
    let [taskTime, setTaskTime] = React.useState<string | null>(null);
    let [username, setUsername] = React.useState<string | null>(null);
    let [containerWidth, setContainerWidth] = React.useState<Breakpoint>("sm");

    function handleSnackbarClose() {
        setSnackbarOpen(false);
    }

    return (
        <Container maxWidth={containerWidth}>
            <TaskTable setSnackbarOpen={setSnackbarOpen} setTaskTime={setTaskTime} isEnabled={Boolean(username)} />
            <UserChip username={username} setUsername={setUsername} setContainerWidth={setContainerWidth} />

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={5000}
                onClose={handleSnackbarClose}
                message="Task sheet data updated."
            />
            <Dialog
                open={Boolean(taskTime)}
                onClose={() => setTaskTime(null)}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{"Task Status"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        Task Completed at: {taskTime}
                    </DialogContentText>
                </DialogContent>
            </Dialog>
        </Container>
    )

}

export default App
