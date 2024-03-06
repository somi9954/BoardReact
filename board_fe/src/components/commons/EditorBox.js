import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';

function EditorBox() {
  return (
    <Editor
      ref={editorRef}
      initialValue={content || ' '} // 글 수정 시 사용
      initialEditType="markdown" // wysiwyg & markdown
      previewStyle={window.innerWidth > 1000 ? 'vertical' : 'tab'} // tab, vertical
      hideModeSwitch={true}
      height="calc(100% - 10rem)"
      theme={''} // '' & 'dark'
      usageStatistics={false}
      toolbarItems={toolbarItems}
      useCommandShortcut={true}
      plugins={[colorSyntax]}
    />
  );
}

export default EditorBox;