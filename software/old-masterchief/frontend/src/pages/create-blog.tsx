import MDEditor from '@uiw/react-md-editor';
import { useState } from 'react';
import Layout from '../components/layout';

export default function CreateBlogPage() {
  const [value, setValue] = useState<string | undefined>();

  console.log(value);
  return (
    <Layout>
      {/*<h1>Edit Blog Post</h1>*/}
      <a
        href="https://imagekit.io/dashboard/media-library?sort=DESC_CREATED&view=GRID"
        target="_blank"
      >
        Image Hosting
      </a>
      <br />
      <a>Save</a>
      <div style={{ display: 'flex' }}>
        <label style={{ flex: 1 }}>
          Title
          <input />
        </label>
        <label style={{ flex: 1 }}>
          Slug
          <input />
        </label>
      </div>

      <MDEditor value={value} onChange={setValue} height={600} />
      {/*<MDEditor.Markdown source={value} style={{ whiteSpace: 'pre-wrap' }} />*/}
    </Layout>
  );
}
