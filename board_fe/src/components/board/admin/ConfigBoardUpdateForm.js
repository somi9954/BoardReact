import react, { useEffect, useState } from 'react';
import { InputText } from '../../commons/InputStyle';
import on from '../../../images/button/on.png';
import off from '../../../images/button/off.png';
import { BigButton, ButtonGroup } from '../../commons/ButtonStyle';
import sizeNames from '../../../styles/sizes';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import loadable from '@loadable/component';

const { medium } = sizeNames;

const FormBox = styled.form`
  dl {
    display: flex;
    padding: 10px 15px;
    align-items: center;
    dt {
      width: 130px;
      font-size: ${medium};
      font-weight: bold;
    }
    dd {
      flex-grow: 1;
    }
  }
  dl + dl {
    border-top: 1px solid #d5d5d5;
  }
  dl:last-of-type {
    margin-bottom: 15px;
  }
  img.radio {
    width: 30px;
    align-items: center;
    margin-left: 5px;
  }

  .boardCategories {
    font-size: ${medium};
    cursor: pointer;
    width: 100%;
    height: 6.25em;
    resize: none;
    border: 1px solid #d5d5d5;
  }
`;

const ErrorMessages = loadable(() => import('../../commons/ErrorMessages'));

const ConfigBoardUpdateForm = ({
  onSubmit,
  onChange,
  form,
  errors,
  onActive,
  onAuthority,
}) => {
  const { t } = useTranslation();

  return (
    <FormBox onSubmit={onSubmit}>
      <dl>
        <dt>{t('게시판 아이디')}</dt>
        <dd>
          <InputText
            type="text"
            name="bId"
            value={form && form.bId ? form.bId : ''}
            onChange={onChange}
            disabled
          />
          <ErrorMessages errors={errors} field="bId" />
        </dd>
      </dl>
      <dl>
        <dt>{t('게시판 이름')}</dt>
        <dd>
          <InputText
            type="text"
            name="bName"
            value={form && form.bName ? form.bName : ''}
            onChange={onChange}
          />
          <ErrorMessages errors={errors} field="bName" />
        </dd>
      </dl>

      <dl>
        <dt>{t('사용 여부')}</dt>
        <dd>
          <span onClick={() => onActive(true)}>
            {form.active === true ? (
              <img src={on} className="radio" alt="라디오버튼" />
            ) : (
              <img src={off} className="radio" alt="라디오버튼" />
            )}{' '}
            {t('사용')}
          </span>
          <span onClick={() => onActive(false)}>
            {form.active === false ? (
              <img src={on} className="radio" alt="라디오버튼" />
            ) : (
              <img src={off} className="radio" alt="라디오버튼" />
            )}{' '}
            {t('미사용')}
          </span>
        </dd>
      </dl>
      <dl>
        <dt>{t('글쓰기 권한')}</dt>
        <dd>
          <span onClick={() => onAuthority('add', 'ALL')}>
            {form.authority === 'ALL' ? (
              <img src={on} className="radio" alt="라디오버튼" />
            ) : (
              <img src={off} className="radio" alt="라디오버튼" />
            )}{' '}
            {t('전체(비회원 + 회원 + 관리자)')}
          </span>
          <span onClick={() => onAuthority('add', 'USER')}>
            {form.authority === 'USER' ? (
              <img src={on} className="radio" alt="라디오버튼" />
            ) : (
              <img src={off} className="radio" alt="라디오버튼" />
            )}{' '}
            {t('회원')}
          </span>
          <span onClick={() => onAuthority('add', 'ADMIN')}>
            {form.authority === 'ADMIN' ? (
              <img src={on} className="radio" alt="라디오버튼" />
            ) : (
              <img src={off} className="radio" alt="라디오버튼" />
            )}{' '}
            {t('관리자')}
          </span>
        </dd>
      </dl>
      <dl>
        <dt>{t('분류')}</dt>
        <dd>
          <textarea
            name="category"
            className="boardCategories"
            placeholder="분류가 여러개인 경우는 엔터키를 눌러서 줄개행 해주세요."
            value={form && form.category ? form.category : ''}
            onChange={onChange}
          />
        </dd>
      </dl>

      <ButtonGroup>
        <BigButton
          type="submit"
          color="info"
          bcolor="info"
          height="50px"
          size="medium"
        >
          {t('작성하기')}
        </BigButton>
        <BigButton
          type="reset"
          color="white"
          bcolor="info"
          height="50px"
          size="medium"
          fcolor="info"
        >
          {t('다시입력')}
        </BigButton>
      </ButtonGroup>
    </FormBox>
  );
};

export default react.memo(ConfigBoardUpdateForm);
