import styled from "styled-components";
import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { Link, useParams } from "react-router-dom";
import { getPosts } from "../../WebAPI";

const Root = styled.div`
  width: 700px;
  margin: 0 auto;
  padding: 30px 0;
`;

const PostContainer = styled.div`
  border: 1px solid rgba(0, 0, 0, 0.3);
  padding: 15px;
  margin-top: 14px;
  height: 180px;
`;

const PostTop = styled.div`
  border-bottom: 1px solid rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
`;
const PostTitle = styled(Link)`
  font-size: 22px;
  color: #333;
  text-decoration: none;
  flex: 1;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;

const PostContent = styled.div`
  width: 100%;
  padding: 15px 0;
  font-size: 14px;
  color: #5f5f5f;
  word-break: break-all;
`;

const PostDate = styled.div`
  color: rgba(0, 0, 0, 0.8);
  font-size: 14px;
  margin-left: 16px;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 24px;
`;

const PageBtnGroup = styled.div`
  display: flex;
  width: 120px;
`;

const FirstPage = styled(Link)`
  display: none;
  text-decoration: none;
  color: #3c3c3c;
  font-size: 14px;

  ${(props) =>
    props.$active &&
    `
      display: flex;
    `}
`;
const PreviousPage = styled(Link)`
  display: none;
  text-decoration: none;
  color: #3c3c3c;
  margin-left: 16px;
  font-size: 14px;

  ${(props) =>
    props.$active &&
    `
      display: flex;
    `}
`;
const NextPage = styled(Link)`
  display: none;
  text-decoration: none;
  margin-left: 16px;
  color: #3c3c3c;
  font-size: 14px;

  ${(props) =>
    props.$active &&
    `
      display: flex;
    `}
`;
const LastPage = styled(Link)`
  display: none;
  text-decoration: none;
  margin-left: 16px;
  color: #3c3c3c;
  font-size: 14px;

  ${(props) =>
    props.$active &&
    `
      display: flex;
    `}
`;

function Post({ post }) {
  return (
    <PostContainer>
      <PostTop>
        <PostTitle to={`/posts/${post.id}`}>{post.title}</PostTitle>
        <PostDate>{new Date(post.createdAt).toLocaleString()}</PostDate>
      </PostTop>
      <PostContent>{post.body.slice(0, 200)}</PostContent>
    </PostContainer>
  );
}

Post.propTypes = {
  post: PropTypes.object,
};

export default function ArchivePage() {
  const [posts, setPosts] = useState([]);
  const lastPage = useRef();
  let { page } = useParams();
  page = !page ? 1 : Number(page);

  useEffect(() => {
    getPosts(page)
      .then((res) => {
        const totalPage = Math.ceil(res.headers.get("x-total-count") / 5);
        lastPage.current = totalPage;
        return res.json();
      })
      .then((posts) => setPosts(posts));
  }, [page]);

  return (
    <Root>
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
      <Pagination>
        <PageBtnGroup>
          <FirstPage to={`/archives/1`} $active={page !== 1}>
            第一頁
          </FirstPage>
          <PreviousPage to={`/archives/${page - 1}`} $active={page - 1 > 0}>
            上一頁
          </PreviousPage>
        </PageBtnGroup>
        <div>
          第 {page} 頁 / 共 {lastPage.current} 頁
        </div>
        <PageBtnGroup>
          <NextPage
            to={`/archives/${page + 1}`}
            $active={page + 1 <= lastPage.current}
          >
            下一頁
          </NextPage>
          <LastPage
            to={`/archives/${lastPage.current}`}
            $active={page !== lastPage.current}
          >
            最末頁
          </LastPage>
        </PageBtnGroup>
      </Pagination>
    </Root>
  );
}
