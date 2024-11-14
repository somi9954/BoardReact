import apiRequest from '../../lib/apiRequest';

export default async function responseList() {
  try {
    const res = await apiRequest('/member/admin/memberList', 'GET');
    console.log('응답', res);

    if (res.data && Array.isArray(res.data.data)) {
      return res.data.data;
    } else {
      console.error('잘못된 데이터 형식:', res.data);
      throw new Error('잘못된 응답 형식');
    }
  } catch (err) {
    console.error('API 요청 실패:', err);
    throw err;
  }
}
