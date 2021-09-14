import styled from "styled-components";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getSinglePost } from "../../WebAPI";

const Root = styled.div`
  width: 700px;
  margin: 0 auto;
`;

const PostContainer = styled.div`
  border-radius: 5px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
`;
const PostTitle = styled.div`
  margin: 16px 0;
  font-size: 24px;
  color: #333;
`;

const PostDate = styled.div`
  text-align: right;
  width: 100%;
  color: rgba(0, 0, 0, 0.8);
  border-bottom: 1px solid rgba(0, 0, 0, 0.3);
`;

const PostContent = styled.div`
  padding: 30px;
  line-height: 1.5rem;
  color: #5f5f5f;
`;

export default function PostPage() {
  const [post, setPost] = useState([]);
  const { id } = useParams();
  useEffect(() => {
    getSinglePost(id).then((post) => setPost(post));
  }, [id]);

  return (
    <Root>
      {post && (
        <PostContainer>
          <PostTitle>{post.title}</PostTitle>
          <PostDate>{new Date(post.createdAt).toLocaleString()}</PostDate>
          <PostContent>{post.body}</PostContent>
        </PostContainer>
      )}
    </Root>
  );
}
