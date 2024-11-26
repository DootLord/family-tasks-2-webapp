import './App.css'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import TaskTable from './components/task-table';
import Snackbar from '@mui/material/Snackbar';
import React from 'react';

function App() {
    let [snackbarOpen, setSnackbarOpen] = React.useState(false);


    function handleSnackbarClose() {
        setSnackbarOpen(false);
    }

    return (
        <div>
            <TaskTable setSnackbarOpen={setSnackbarOpen} />
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={5000}
                onClose={handleSnackbarClose}
                message="Task sheet data updated."
            />
        </div>
    )

}

export default App
