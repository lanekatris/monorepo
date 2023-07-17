import {useRef} from "react";

export default function UdiscScorecardUpload(){
    const fileRef = useRef<HTMLInputElement>(null)

    return <><h1>Upload UDISC Scorecard</h1>
        <br />
        <form onSubmit={(e) =>{
            e.preventDefault()
            const body = new FormData();
            console.log('ref', fileRef.current.files[0])
            // body.append('file', fileRef.current?.files?.[0])
            body.append('file', fileRef.current.files[0])
            fetch('/api/upload-udisc-scorecard', {method: 'POST', body})
        }}>
            <input type="file" ref={fileRef} />
            <br />
            <button type="submit">Upload</button>
        </form>
    </>
}