import React from 'react';
import { useTranslation } from 'react-i18next';
import { InputText } from '../commons/InputStyle';
import EditorBox from '../commons/EditorBox';
import { BigButton, ButtonGroup } from '../commons/ButtonStyle';
import styled from 'styled-components';
import sizeNames from '../../styles/sizes';

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
  .category {
    display: flex;
    align-items: center;
    margin-right: 10px;
  }
`;

const BoardUpdateForm = ({
  initialValues,
  form,
  onSubmit,
  onChange,
  handleEditorChange,
}) => {
  const { t } = useTranslation();

  return (
    <FormBox onSubmit={onSubmit}>
      <dl>
        <dt>{t('분류')}</dt>
        <dd className="category">
          {initialValues.board.category.split('\n').map((cat, index) => (
            <div key={index} style={{ marginRight: '10px' }}>
              <input
                type="radio"
                id={cat}
                name="category"
                value={cat}
                checked={form.category === cat}
                onChange={onChange}
              />
              <label htmlFor={cat}>{cat}</label>
            </div>
          ))}
        </dd>
      </dl>
      <dl>
        <dt>{t('제목')}</dt>
        <dd>
          <InputText
            type="text"
            name="subject"
            value={form.subject || ''}
            onChange={onChange}
          />
        </dd>
      </dl>
      <dl>
        <dt>{t('작성자')}</dt>
        <dd>
          <InputText
            type="text"
            id="poster"
            name="poster"
            value={form.poster || ''}
            onChange={onChange}
          />
        </dd>
      </dl>
      {initialValues.board.member && (
        <dl>
          <dt>{t('비밀번호')}</dt>
          <dd>
            <InputText
              type="password"
              name="guestPw"
              value={form.guestPw || ''}
              placeholder={t('게시글_수정_삭제시_비밀번호')}
              onChange={onChange}
            />
          </dd>
        </dl>
      )}
      <dl>
        <dt>{t('내용')}</dt>
        <dd>
          <EditorBox
            content={form.content || ''}
            onEditorChange={handleEditorChange}
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

export default BoardUpdateForm;
