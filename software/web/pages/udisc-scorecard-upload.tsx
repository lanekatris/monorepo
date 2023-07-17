import {useRef} from "react";

export default function UdiscScorecardUpload(){
    const fileRef = useRef<HTMLInputElement>(null)

    return <><h1>Upload UDISC Scorecard</h1>
        <br />
        <form onSubmit={(e) =>{
            e.preventDefault()
            if (!fileRef.current?.files) return

            const body = new FormData();
            body.append('file', fileRef.current.files[0])
            fetch('/api/upload-udisc-scorecard', {method: 'POST', body})
                .then(x => {
                    if (x.status === 200) {
                        alert('Upload successful')
                    } else {
                        alert('Upload failed')
                    }
                })
        }}>
            <input type="file" ref={fileRef} />
            <br />
            <button type="submit">Upload</button>
        </form>
    </>
}