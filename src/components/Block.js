import styled from 'styled-components';
import classnames from 'classnames';

const BlockDiv = styled.div`
  width: 40px;
  height: 40px;
  line-height: 40px;
  background: gray;
  border: solid 1px yellow;
  cursor: pointer;
  &.marked {
    background: #f3c8d2;
  }
  .content {
    width: 100%;
    height: 100%;
    background: #e6e6e6;
    cursor: default;
  }
  .failed {
    background: #f3c8d2;
  }
  .finished {
    background: #9ddcc2;
  }
`;

const Block = ({ adjCount, isMine, opened, failed, finished, marked, className, onClick }) => {
  let content = '';
  const show = (opened || failed);
  if (show && isMine) {
    content = '*';
  } else if (show && adjCount > 0) {
    content = adjCount;
  }

  return (
    <BlockDiv className={classnames('block', className, { marked })} onClick={onClick}>
      {show &&
        <div className={classnames('content', { failed, finished })}>
          {content}
        </div>
      }
    </BlockDiv>
  );
}

export default Block;
  

