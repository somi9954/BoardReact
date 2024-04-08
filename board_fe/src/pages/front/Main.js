import '../Main.scss';
import React from 'react';

const Main = () => {
  return (
    <div className="home-wrapper">
      <div className="home-title">
        <span>Freetalk</span>에 오신걸 환영합니다
      </div>
      <div className="home-contents">
        자유롭게 게시판에 글을 작성하고📝
        <br />
        댓글로 여러 의견을 나눠보세요✏️
      </div>
      <div className="about-project">
        이 프로젝트는 SOMICHO이 레퍼런스로 쓰기위해
        <br />
        <span>React</span>와<span> SpringBoot</span>으로 만들었습니다😎
      </div>
      <div className="my-website">
        <div className="my-website-title">Somi's Website</div>
        <a href="https://github.com/somi9954/BoardReact" target="_blank">
          🏴GitHub
        </a>
      </div>
    </div>
  );
};
export default React.memo(Main);
