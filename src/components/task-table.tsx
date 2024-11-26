import { useEffect, useState } from "react"
import TableContainer from '@mui/material/TableContainer';
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import { TableBody, Zoom } from "@mui/material";

enum TaskStatus {
    INCOMPLETE = "incomplete",
    COMPLETE = "complete",
}

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

export default function TaskTable({ setSnackbarOpen }: { setSnackbarOpen: (open: boolean) => void }) {
    let [taskSheetData, setTaskSheetData] = useState<ITaskSheetData | null | undefined>(undefined);
    let [taskSheetStatus, setTaskSheetStatus] = useState<TaskStatus[][] | undefined>(undefined);
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
                            <TableRow key={rowIndex}>
                                <TableCell align={'center'}>{days[rowIndex]}</TableCell>
                                {
                                    row.map((task, taskIndex) => (
                                        <Zoom in={true} style={{ transitionDelay: ((25 * (rowIndex + 1)) * (taskIndex + 1)) + 'ms' }}>
                                            <TableCell
                                                onClick={() => handleCellClick(days[rowIndex], taskIndex)}
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

        </TableContainer>
    )

    function getClassByStatus(dayIndex: number, taskIndex: number): string {
        if (!taskSheetStatus) {
            return "";
        }
        return taskSheetStatus[dayIndex][taskIndex] === TaskStatus.COMPLETE ? "task-complete" : "task-incomplete";
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

    async function handleCellClick(day: string, taskIndex: number) {
        const fetchResponse = await fetch("/api/sheet/task", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                day,
                taskIndex
            })
        });

        if (!fetchResponse.ok) {
            console.error("Failed to update task status.");
            return;
        }

        setSnackbarOpen(true);


        await fetchSheetStatus();
    }

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
