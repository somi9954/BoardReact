import React, { Component } from 'react';
import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';
import colorSyntax from '@toast-ui/editor-plugin-color-syntax';
import 'tui-color-picker/dist/tui-color-picker.css';
import '@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css';
import '@toast-ui/editor/dist/i18n/ko-kr';

const toolbar = [
  ['heading', 'bold', 'italic', 'strike'],
  ['hr', 'quote', 'ul', 'ol'],
  ['image'],
];

class EditorBox extends Component {
  constructor(props) {
    super(props);
    this.editorRef = React.createRef();
  }

  handleChange = () => {
    const content = this.editorRef.current.getInstance().getMarkdown(); // HTML 대신 Markdown을 가져옴
    if (typeof this.props.onEditorChange === 'function') {
      this.props.onEditorChange(content);
    }
  };

  render() {
    const { content } = this.props;
    return (
      <Editor
        initialValue={content || ' '}
        previewStyle="vertical"
        theme=""
        usageStatistics={false}
        toolbarItems={toolbar}
        height="600px"
        initialEditType="wysiwyg"
        useCommandShortcut={false}
        plugins={[colorSyntax]}
        language="ko-KR"
        ref={this.editorRef}
        onChange={this.handleChange}
      />
    );
  }
}

export default EditorBox;
