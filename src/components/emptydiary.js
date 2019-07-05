import { h } from 'preact';

import style from './emptydiary.css';

const EmptyDiary = () => (
  <div class={style.empty}>
    <h2>Welcome</h2>
    <p>Your diary is empty.</p>
    <p>
      Location Diary allows you to keep a track of where you have been.
      Everything is saved securely so that only you can access your data.
    </p>
    <p>With each entry, you can:</p>
    <ol>
      <li>
        use your current location, if supported by your browser, or select it
        from the map
      </li>
      <li>add a message to keep a note of what you were doing</li>
    </ol>
    <p>
      To get started, click on <em>New Entry</em> and create your first entry.
    </p>
  </div>
);

export default EmptyDiary;
