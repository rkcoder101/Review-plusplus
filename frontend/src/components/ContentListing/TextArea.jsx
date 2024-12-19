import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

export default function TextArea({ index, value, updateSubtask, onFileUpload }) {
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
                    id={`outlined-textarea-${index}`}
                    label={`Subtask ${index + 1}`}
                    placeholder="Write the subtask here"
                    multiline
                    fullWidth
                    value={value}
                    onChange={(event) =>
                        updateSubtask(index, 'text', event.target.value)
                    }
                />
            </div>
            <div>
                <Button
                    component="label"
                    variant="contained"
                    startIcon={<CloudUploadIcon />}
                >
                    Upload files
                    <VisuallyHiddenInput
                        type="file"
                        onChange={(event) =>
                            onFileUpload(index, Array.from(event.target.files))
                        }
                        multiple
                    />
                </Button>
            </div>
        </Box>
    );
}
