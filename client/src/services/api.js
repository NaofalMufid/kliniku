import axios from 'axios';
import dayjs from 'dayjs';
const API_BASE_URL = 'http://localhost:3030/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add request interceptor to include token in headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle unauthorized responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
};

export const dokterAPI = {
  list: async (page = 0, size = 10, sortBy = 'dokNama', sort = 'ASC') => {
    const response = await api.get(`/dokter?page=${page}&size=${size}&sortBy=${sortBy}&sort=${sort}`);
    return response.data;
  },
  add: async (dokterData) => {
    const response = await api.post('/dokter', dokterData);
    return response.data;
  },
  edit: async (dokId, dokterData) => {
    const response = await api.put(`/dokter/${dokId}`, dokterData);
    return response.data;
  },
  delete: async (dokId) => {
    const response = await api.delete(`/dokter/${dokId}`);
    return response.data;
  },
};

export const pasienAPI = {
  list: async (page = 0, size = 10, sortBy = 'rawatNama', sort = 'ASC', tglAwal, tglAkhir, gender) => {
    const response = await api.get(`/rawat/pasien`, {
      params: {
        page,
        size,
        sortBy,
        sort,
        ...(tglAwal && { tglAwal: dayjs(tglAwal).format('YYYY-MM-DD') }),
        ...(tglAkhir && { tglAkhir: dayjs(tglAkhir).format('YYYY-MM-DD') }),
        ...(gender && { gender })
      }
    })
    return response.data;
  }
}

export const pemeriksaanAPI = {
  list: async (page, rowsPerPage, sortBy = 'rawatNama', sortDirection = 'ASC', namaPasien, tglAwal, tglAkhir) => {
    const response = await api.get(`/pemeriksaan`, {
      params: {
        page,
        size: rowsPerPage,
        sortBy,
        sort: sortDirection,
        ...(namaPasien && {nama_pasien: namaPasien}),
        ...(tglAwal && {tgl_awal: tglAwal}),
        ...(tglAkhir && {tgl_akhir: tglAkhir})
      }
    });
    return response.data;
  },
};