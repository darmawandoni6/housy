import { env } from '@config/environment';
import axios from 'axios';
import Swal from 'sweetalert2';

const httpService = axios.create({
  baseURL: env.BASE_URL,
  withCredentials: true,
});

httpService.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error),
);

httpService.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { data } = error.response;
      const { status, message } = data;

      Swal.fire(status.toString(), message, 'error').then(() => {
        if (status === 401) {
          window.location.href = '/';
        }
      });
      return Promise.reject(data);
    }

    Swal.fire('500', error.message, 'error');

    return Promise.reject({
      message: error.message,
      status: 500,
    });
  },
);

export default httpService;
