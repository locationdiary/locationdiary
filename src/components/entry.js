import { h } from 'preact';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import 'dayjs/locale/en';

import style from './entry.css';

dayjs.extend(LocalizedFormat);

const Entry = ({ entry }) => (
  <div class={entry.provisional ? style.provisional : style.entry}>
    <div class={style.date}>{dayjs(entry.date).format('lll')}</div>
    <div>
      {entry.message && <b>{entry.message}</b>}
      {entry.message && entry.location && <span> @ </span>}
      {entry.location && <em>{entry.location.geocode.display_name}</em>}
    </div>
  </div>
);

export default Entry;
