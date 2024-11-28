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

function App() {
    let [snackbarOpen, setSnackbarOpen] = React.useState(false);
    let [taskTime, setTaskTime] = React.useState<string | null>(null);

    function handleSnackbarClose() {
        setSnackbarOpen(false);
    }

    return (
        <React.Fragment>
            <TaskTable setSnackbarOpen={setSnackbarOpen} setTaskTime={setTaskTime} />
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
        </React.Fragment>
    )

}

export default App
