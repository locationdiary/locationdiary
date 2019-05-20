import { h } from 'preact';
import style from './style';
import FullMap from '../../components/fullmap';

const Home = () => (
	<div class={style.home}>
		<FullMap />
	</div>
);

export default Home;
