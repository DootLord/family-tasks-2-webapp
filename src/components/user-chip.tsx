import Autocomplete from "@mui/material/Autocomplete";
import Chip from "@mui/material/Chip";
import { Breakpoint } from "@mui/material/styles";
import TextField from "@mui/material/TextField";

interface UserChipProps {
    username: string | null
    setUsername: (username: string) => void,
    setContainerWidth: (width: Breakpoint) => void
}

enum EUsers {
    ADAM = "Adam",
    JACK = "Jack",
    SHAUN = "Shaun",
    DAD = "Dad",
}

const users = Object.values(EUsers);

export default function UserChip({ username, setUsername, setContainerWidth }: UserChipProps) {

    if (!username) {
        return (
            <Autocomplete
                options={users}
                renderInput={(params) => <TextField {...params} label="User" />}
                onChange={(_, value) => changeHandler(value as EUsers)}
            >

            </Autocomplete>
        )
    }

    return (
        <Chip label={`Welcome ${username}!`} variant="outlined" />
    )

    function changeHandler(value: EUsers) {
        setUsername(value);
        setContainerWidth("xl");
    }
}

