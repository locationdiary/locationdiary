import { h, Component } from "preact";
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import 'dayjs/locale/en';

import style from "./entry.css";

dayjs.extend(LocalizedFormat);

const Entry = ({entry}) => (
  <div class={style.entry}>
    <div class={style.date}>{dayjs(entry.date).format('lll')}</div>
    <div><b>{entry.message}</b> @ <em>{entry.location && entry.location.geocode.display_name}</em></div>
  </div>
);

export default Entry;