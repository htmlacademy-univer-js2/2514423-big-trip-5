import { filterType } from '../const';
import { isFuturePoint, isPastPoint, isPresentPoint } from './utils';

const filter = {
  [filterType.EVERYTHING]: (points)=> points,
  [filterType.FUTURE]: (points)=> points.filter((point)=>
    isFuturePoint(point.date_from)
  ),
  [filterType.PRESENT]: (points)=> points.filter((point)=>
    isPresentPoint(point.date_from, point.date_to)
  ),
  [filterType.PAST]: (points)=> points.filter((point)=>
    isPastPoint(point.date_to)
  )
};

export {filter};
