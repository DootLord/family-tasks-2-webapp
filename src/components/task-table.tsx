import { useEffect, useState } from "react"
import TableContainer from '@mui/material/TableContainer';
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import { TableBody } from "@mui/material";

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

export default function TaskTable() {
    let [taskSheetData, setTaskSheetData] = useState<ITaskSheetData | undefined>(undefined);
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    useEffect(() => {
        async function fetchData() {
            const fetchResponse = await fetch("/api/sheet");

            if (!fetchResponse.ok) {
                console.error("Failed to fetch task sheet data.");
                return;
            }

            const fetchData = await fetchResponse.json();

            setTaskSheetData(fetchData);
        }

        fetchData();
    })

    if (!taskSheetData) {
        return <div>Loading...</div>
    }

    const rows = processTableData(taskSheetData);

    return (
        <TableContainer>
            <Table sx={{ mindWidth: 650 }} aria-label="Task Table">
                <TableHead>
                    <TableRow>
                        <TableCell>X</TableCell>
                        {
                            taskSheetData.jobs.map((job, index) => (
                                <TableCell key={index}>{job}</TableCell>
                            ))
                        }

                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                    rows.map((row, index) => (
                        <TableRow key={index}>
                            <TableCell>{days[index]}</TableCell>
                            {
                                row.map((task, index) => (
                                    <TableCell key={index}>{task}</TableCell>
                                ))
                            }
                        </TableRow>
                    ))
                    }
                </TableBody>
            </Table>

        </TableContainer>
    )

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