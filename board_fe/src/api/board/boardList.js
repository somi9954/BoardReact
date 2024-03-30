import apiRequest from '../../lib/apiRequest';

export default function responseList(bId) {
  return new Promise((resolve, reject) => {
    // 실제 게시판 ID 값을 포함하여 요청을 보냄
    apiRequest(`/board/list/${bId}`, 'GET')
      .then((res) => {
        console.log('Board List Response:', res.data); // 데이터 출력
        if (!res.data.success) {
          reject(res.data.message); // 오류 메시지 처리
        } else {
          resolve(res.data); // 데이터 전송
        }
      })
      .catch((err) => {
        console.error('Error fetching board data:', err); // 오류 메시지 출력
        reject(err); // 오류 처리
      });
  });
}
