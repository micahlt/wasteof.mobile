import AsyncStorage from '@react-native-async-storage/async-storage';
import {useState, useEffect} from 'react';

const useSession = () => {
  const [session, setSession] = useState(null);
  useEffect(() => {
    Promise.all([
      AsyncStorage.getItem('username'),
      AsyncStorage.getItem('token'),
    ]).then(arr => {
      if (arr[0] && arr[1]) {
        setSession({
          username: arr[0],
          token: arr[1],
        });
      } else {
        setSession(false);
      }
    });
  }, []);
  return session;
};

export default useSession;
