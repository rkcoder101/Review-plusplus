import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { fetchOrLoginUser } from '../redux/slices/userSlice';

export const useUser = () => {
    const dispatch = useDispatch();
    const { user, status, error } = useSelector((state) => state.user);

    useEffect(() => {
        if (!user && status === 'idle') {
            dispatch(fetchOrLoginUser())
                .unwrap()
                .catch((fetchError) => {
                    console.error('Failed to fetch user:', fetchError);
                });
        }
    }, [dispatch, user, status]);

    return { user, status, error };
};
