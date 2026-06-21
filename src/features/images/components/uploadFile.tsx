import { allowedFileTypes } from '../types/file';
import type { ComponentProps } from 'react';


export function UploadFile({
    ref,
    ...props
}: ComponentProps<'input'> ) {

    return (
        <div>
            <input
                ref={ref}
                type="file"
                accept={Object.keys(allowedFileTypes).join(',')}
            />
        </div>
    )
}