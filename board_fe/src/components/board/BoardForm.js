import { useTranslation } from 'react-i18next';
import { InputText } from '../commons/InputStyle';
import { ButtonGroup, BigButton } from '../commons/ButtonStyle';
import sizeNames from '../../styles/sizes';
import styled from 'styled-components';
import loadable from '@loadable/component';
import React from 'react';
import EditorBox from '../commons/EditorBox';

const ErrorMessages = loadable(() => import('../commons/ErrorMessages'));

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
`;

const BoardForm = ({ onSubmit, onChange, form, errors, handleEditor }) => {
  const { t } = useTranslation();

  const contentValue = form.editorBody || '';

  return (
    <FormBox onSubmit={onSubmit}>
      <dl>
        <dt>{t('분류')}</dt>
        <dd>
          <InputText
            type="radio"
            name="category"
            value={form.category}
            onChange={onChange}
          />
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
          <ErrorMessages errors={errors} field="subject" />
        </dd>
      </dl>
      <dl>
        <dt>{t('작성자')}</dt>
        <dd>
          <InputText
            type="text"
            name="poster"
            value={form.poster || ''}
            onChange={onChange}
          />
        </dd>
      </dl>
      <dl>
        <dt>{t('내용')}</dt>
        <dd>
          <EditorBox
            value="내용을 입력하세요." // value props로 내용 전달
            onChange={handleEditor} // onChange 핸들러 전달
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


export default React.memo(BoardForm);
