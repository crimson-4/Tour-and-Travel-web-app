import axios from 'axios';
import { showAlert } from './alerts';
//type is either 'password' or data
export const updateSettings = async (data, type) => {
  try {
    //console.log(...data, 'ye hai data');
    let url =
      type === 'success'
        ? 'http://127.0.0.1:3000/api/v1/users/updateMyPassword'
        : 'http://127.0.0.1:3000/api/v1/users/updateMe';
    const res = await axios({
      method: 'PATCH',
      url,
      data: {
        ...data,
      },
    });

    console.log(res);
    if (res.data.status === 'success') {
      console.log('resultafater', res);
      showAlert('success', `${url} update Successfuly`);
    }
  } catch (err) {
    console.log('yha error', err);
    showAlert('error', err.response.data.message);
  }
};
