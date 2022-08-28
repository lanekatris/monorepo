import NoteSearcher from '../../components/note-searcher/note-searcher';
import { useDiscsQuery } from '../../graphql';

export default function FeedPage() {
  const { data, loading, error } = useDiscsQuery();

  console.log({ data, loading, error });
  return (
    <div className="main container">
      <h4>Actions</h4>
      <section>
        <details>
          <summary>Create Event</summary>
          <p>
            <div id="app"></div>
          </p>
        </details>
        <details>
          <summary>Upload Pixel Notes</summary>
          <p>
            <form
              method="post"
              action="/pixel-recorder-upload"
              encType="multipart/form-data"
            >
              <input type="file" name="files" multiple />
              <input type="submit" />
            </form>
          </p>
        </details>
        <details>
          <summary id="notes-title">Notes Search</summary>
          <p>
            <NoteSearcher />
          </p>
        </details>
      </section>

      <h4>Feed ()</h4>
      <ul className="feed"></ul>
    </div>
  );
}
