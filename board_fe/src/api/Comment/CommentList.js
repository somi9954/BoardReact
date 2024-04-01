import apiRequest from '../../lib/apiRequest';

export default function responseList(boardDataSeq) {
  return new Promise((resolve, reject) => {
    // 실제 게시판 ID 값을 포함하여 요청을 보냄
    apiRequest(`/comment/list/${boardDataSeq}`, 'GET')
      .then((res) => {
        console.log('Comment List Response:', res.data); // 데이터 출력
        resolve(res.data); // 댓글 목록 데이터 전체를 반환
      })
      .catch((err) => {
        console.error('Error fetching comment data:', err); // 오류 메시지 출력 수정
        reject(err); // 오류 처리
      });
  });
}
