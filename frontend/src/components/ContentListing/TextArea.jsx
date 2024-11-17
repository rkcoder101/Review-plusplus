import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
export default function TextArea() {
    const VisuallyHiddenInput = styled('input')({
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
        height: 1,
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        left: 0,
        whiteSpace: 'nowrap',
        width: 1,
    });
    return (

        <Box sx={{ width: '80%' }}>
            <div>
                <TextField
                    id="outlined-textarea"
                    label="Subtask"
                    placeholder="Subtask"
                    multiline
                    fullWidth

                />
            </div>
            <div>
                <Button
                    component="label"
                    role={undefined}
                    variant="contained"
                    startIcon={<CloudUploadIcon />}
                >
                    Upload files
                    <VisuallyHiddenInput
                        type="file"
                        onChange={(event) => console.log(event.target.files)}
                        multiple
                    />
                </Button>
            </div>
        </Box>



    );
}
