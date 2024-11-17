
import Box from '@mui/material/Box';
import { useState } from 'react';
import TextArea from './TextArea';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Navigbar from '../Navigbar/Navigbar';
import Button from '@mui/material/Button';
export default function ContentListing() {
    const [textAreas, setTextAreas] = useState(['']);
    const addTextArea = () => {
        setTextAreas([...textAreas, '']);
    };
    const removeLastTextArea = () => {
        if (textAreas.length > 1) {
            setTextAreas(textAreas.slice(0, -1));
        }
    };
    let reviewer = 'Magnus', date = '20/10/2024'
    return (
        <div >
            <div className="flex flex-col gap-6 items-center">
                <div className='flex flex-row justify-between w-[80%] text-xl'>
                    <div>Assigned by: {reviewer}</div>
                    <div>Date of assigning {date}</div>


                </div>
                <div className='flex flex-col items-center gap-4 w-[80%] '>
                    {textAreas.map((_, index) => (
                        <TextArea key={index} index={index} />
                    ))}

                    <span>
                        <Fab size="medium" color="secondary" aria-label="add" onClick={addTextArea} style={{ marginRight: '16px' }} >
                            <AddIcon />
                        </Fab>
                        <Fab size="medium" color="secondary" aria-label="remove" onClick={removeLastTextArea}  >
                            <RemoveIcon />
                        </Fab>
                    </span>
                </div>
                <span>
                    <Button variant="outlined" style={{ margin: "8px" }}>Select deadline date</Button>
                    <Button variant="outlined" style={{ margin: "8px" }}>Select users and teams</Button>
                    <Button variant="contained" style={{ margin: "8px" }}>Assign</Button>
                </span>
            </div>
        </div>
    );
}