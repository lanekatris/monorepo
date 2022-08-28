import MDEditor from '@uiw/react-md-editor';
import { useState } from 'react';

export default function CreateBlogPage() {
  const [value, setValue] = useState<string | undefined>();
  return (
    <div className="container" data-color-mode="dark">
      <h1>Create Bog Post</h1>
      <a>Image Hosting</a>
      <label>
        Title
        <input />
      </label>
      <MDEditor value={value} onChange={setValue} />
      <MDEditor.Markdown source={value} style={{ whiteSpace: 'pre-wrap' }} />
    </div>
  );
}
