import { useNavigate } from "react-router-dom";
import { useField } from "../hooks";
import styled from "styled-components";

const Button = styled.button`
  background: Bisque;
  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border: 2px solid Chocolate;
  border-radius: 3px;
`;
const Input = styled.input`
  margin: 0.25em;
`;

const CreateNew = (props) => {
  const content = useField("text");
  const author = useField("text");
  const info = useField("text");

  const navigate = useNavigate("/");
  const handleSubmit = (e) => {
    e.preventDefault();

    props.addNew({
      content: content.value,
      author: author.value,
      info: info.value,
      votes: 0,
    });
    navigate("/");
  };

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          content
          <Input {...content} />
        </div>
        <div>
          author
          <Input {...author} />
        </div>
        <div>
          url for more info
          <Input {...info} />
        </div>
        <Button>create</Button>
        <Input
          type="button"
          onClick={() => {
            info.onReset();
            author.onReset();
            content.onReset();
          }}
          value="reset"
        />
      </form>
    </div>
  );
};

export default CreateNew;
