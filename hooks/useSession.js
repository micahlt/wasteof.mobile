import AsyncStorage from '@react-native-async-storage/async-storage';
import {useState, useEffect} from 'react';

const useSession = () => {
  const [session, setSession] = useState(null);
  useEffect(() => {
    Promise.all([
      AsyncStorage.getItem('username'),
      AsyncStorage.getItem('token'),
    ]).then(arr => {
      setSession({
        username: arr[0],
        token: arr[1],
      });
    });
  }, []);
  return session;
};

export default useSession;
