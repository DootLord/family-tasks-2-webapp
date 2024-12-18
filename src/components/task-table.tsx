import { useEffect, useState } from "react"
import TableContainer from '@mui/material/TableContainer';
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import { Alert, Menu, MenuItem, TableBody, Zoom } from "@mui/material";
import InfoIcon from '@mui/icons-material/Check';

const dateFormatOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
};

interface ITaskData {
    status: TaskStatus,
    updated: string
}

enum TaskStatus {
    INCOMPLETE = "incomplete",
    COMPLETE = "complete",
}

enum DayToIndex {
    "monday" = 0,
    "tuesday" = 1,
    "wednesday" = 2,
    "thursday" = 3,
    "friday" = 4,
    "saturday" = 5,
    "sunday" = 6
}

const IndexToDay = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

interface ITaskSheetData {
    "id": string,
    "name": string,
    "jobs": string[],
    "monday": string[],
    "tuesday": string[],
    "wednesday": string[],
    "thursday": string[],
    "friday": string[],
    "saturday": string[],
    "sunday": string[]
}

interface ITaskSelection {
    day: string,
    taskIndex: number
}

interface ITaskTableProps {
    setSnackbarOpen: (open: boolean) => void,
    setTaskTime: (time: string) => void,
    isEnabled: boolean,
    username: string | null
}

export default function TaskTable({ setSnackbarOpen, setTaskTime, isEnabled, username }: ITaskTableProps) {
    let [taskSheetData, setTaskSheetData] = useState<ITaskSheetData | null | undefined>(undefined);
    let [taskSheetStatus, setTaskSheetStatus] = useState<ITaskData[][] | undefined>(undefined);
    let [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
    let [taskSelection, setTaskSelection] = useState<ITaskSelection | null>(null);
    let uniqueId = 0;
    let menuOpen = Boolean(menuAnchor);

    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        const fetchResponse = await fetch("/api/sheet");

        if (!fetchResponse.ok) {
            console.error("Failed to fetch task sheet data.");
            setTaskSheetData(null);
            return;
        }

        const fetchData = await fetchResponse.json();

        setTaskSheetData(fetchData);
        await fetchSheetStatus();
    }

    if (!isEnabled) {
        return (
            <Alert icon={<InfoIcon fontSize="inherit" />} severity="info">
                Please select a user first!
            </Alert>
        )
    }

    if (taskSheetData === null) {
        return <div>Failed to fetch task sheet data. Make sure the API is on, dummy...</div>
    }

    if (!taskSheetData || !taskSheetStatus) {
        return <div>Loading...</div>
    }

    const rows = processTableData(taskSheetData);

    return (
        <TableContainer >
            <Table sx={{ mindWidth: 650 }} aria-label="Task Table">
                <TableHead>
                    <TableRow>
                        <TableCell align={'center'}>X</TableCell>
                        {
                            taskSheetData.jobs.map((job, index) => (
                                <TableCell align={'center'} key={index}>{job}</TableCell>
                            ))
                        }

                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        rows.map((row, rowIndex) => (
                            <TableRow key={uniqueId++}>
                                <TableCell align={'center'} className={getWeekHighlight(rowIndex + 1)}>{days[rowIndex]}</TableCell>
                                {
                                    row.map((task, taskIndex) => (
                                        <Zoom key={uniqueId++} in={true} style={{ transitionDelay: ((25 * (rowIndex + 1)) * (taskIndex + 1)) + 'ms' }}>
                                            <TableCell
                                                onClick={(event) => handleCellClick(event, days[rowIndex], taskIndex)}
                                                className={getClassByStatus(rowIndex, taskIndex)}
                                                data-day={days[rowIndex]}
                                                data-index={taskIndex}
                                                align={'center'}
                                                key={rowIndex + taskIndex}>
                                                {task}
                                            </TableCell>
                                        </Zoom>

                                    ))
                                }
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>

            <Menu
                anchorEl={menuAnchor}
                open={menuOpen}
                onClose={() => setMenuAnchor(null)}
            >
                <MenuItemList />
            </Menu>

        </TableContainer>
    )

    function handleCellClick(event: React.MouseEvent<HTMLTableCellElement>, day: string, taskIndex: number) {
        const target = event.target as HTMLElement;
        setTaskSelection({
            day,
            taskIndex
        });
        setMenuAnchor(target);
    }

    function MenuItemList() {
        if (!taskSelection || !taskSheetStatus) {
            return null;
        }

        let menuItems = [];

        // V this is gross, but it's the only way to get the key of an enum from a string. I should've just used numbers...
        const dayKey = taskSelection.day.toLowerCase() as keyof typeof DayToIndex;
        const dayIndex = DayToIndex[dayKey] as number;
        const taskStatus = taskSheetStatus[dayIndex][taskSelection.taskIndex].status;
        const isUsersTask = indexContainsUsername(dayIndex, taskSelection.taskIndex);

        switch (taskStatus) {
            case TaskStatus.COMPLETE:
                menuItems.push(<MenuItem key="getDetails" onClick={() => displayTaskData(dayIndex, taskSelection.taskIndex)} >Get Details</MenuItem>);

                if(!isUsersTask) { break;}
                menuItems.push(<MenuItem key="markIncomplete" onClick={() => setTaskStatus(false)} >Mark Incomplete</MenuItem>);

                break;
            case TaskStatus.INCOMPLETE:

                if(!isUsersTask) { break;}
                menuItems.push(<MenuItem key="markComplete" onClick={() => setTaskStatus(true)} >Mark Complete</MenuItem>);
                break;
        }

        if (menuItems.length === 0) {
            setMenuAnchor(null);
            return null;
        }

        return menuItems;
    }

    function getClassByStatus(dayIndex: number, taskIndex: number): string {
        if (!taskSheetStatus || !taskSheetData || !username) { return ""; }
        const classList = [];
        classList.push("task");
        const statusClass = taskSheetStatus[dayIndex][taskIndex].status === TaskStatus.COMPLETE ? "task-complete" : "task-incomplete";
        classList.push(statusClass);

        if (indexContainsUsername(dayIndex, taskIndex)) {
            classList.push("your-task");
        }

        return classList.join(" ");
    }

    function indexContainsUsername(dayIndex: number, taskIndex: number): boolean {
        if (!taskSheetData || !username) {
            return false;
        }

        const sheetDayIndex = IndexToDay[dayIndex] as keyof ITaskSheetData;
        return taskSheetData[sheetDayIndex][taskIndex].includes(username.toLowerCase());
    }

    async function fetchSheetStatus() {
        const fetchResponse = await fetch("/api/sheet/status");

        if (!fetchResponse.ok) {
            console.error("Failed to fetch task sheet status.");
            return;
        }

        const fetchData = await fetchResponse.json();
        setTaskSheetStatus(fetchData);
    }

    async function setTaskStatus(completeTask: boolean = true) {
        setMenuAnchor(null);
        const fetchResponse = await fetch("/api/sheet/task", {
            method: completeTask ? "POST" : "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(taskSelection)
        });

        if (!fetchResponse.ok) {
            console.error("Failed to update task status.");
            return;
        }

        setSnackbarOpen(true);
        await fetchSheetStatus();
    }

    function displayTaskData(dayIndex: number, taskIndex: number) {
        setMenuAnchor(null);
        if (!taskSheetData || !taskSheetStatus) {
            return;
        }

        const updateTime = taskSheetStatus[dayIndex][taskIndex].updated;
        const readableTime = new Date(updateTime).toLocaleString('en-GB', dateFormatOptions);
        setTaskTime(readableTime);
    }

}

function getWeekHighlight(dayIndex: number): string {
    const today = new Date().getDay();
    return today === dayIndex ? "current-day" : "";
}

function processTableData(taskSheetData: ITaskSheetData): string[][] {
    const rows = [];
    rows.push(taskSheetData.monday);
    rows.push(taskSheetData.tuesday);
    rows.push(taskSheetData.wednesday);
    rows.push(taskSheetData.thursday);
    rows.push(taskSheetData.friday);
    rows.push(taskSheetData.saturday);
    rows.push(taskSheetData.sunday);
    return rows;
}
