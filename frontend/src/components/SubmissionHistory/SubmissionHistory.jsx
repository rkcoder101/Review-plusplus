import * as React from 'react';
import Listing from '../Listing/Listing';
export default function SubmissionHistory() {

    return (
        <div>           
            <div>
                <Listing parameters={['id', 'date', 'assignment']} />
            </div>
        </div>
    );
}
