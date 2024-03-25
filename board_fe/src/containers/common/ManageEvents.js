import React, { useCallback, useEffect } from 'react';
import Paging from '../../components/commons/Paging';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

const ManageEvents = ({ match, history }) => {
  const dispatch = useDispatch();

  const { count, page, items } = useSelector(
    ({ event }) => ({
      count: event.count,
      page: event.page,
      items: event.items,
    }),
    shallowEqual
  );

  useEffect(() => {
    dispatch(eventActions.getEvents(1));
  }, [dispatch]);

  const setPage = useCallback(
    (selectedPage) => {
      dispatch(eventActions.getEvents(selectedPage));
    },
    [dispatch]
  );

  return (
    <div>
      <EventList events={items} match={match}/>
      <Paging page={page} count={count} setPage={setPage}/>
    </div>
  );
};

export default ManageEvents;
