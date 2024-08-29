import { useDispatch } from "react-redux";
import { changeFilter } from "../reducers/filterReducer";

const AnecdoteFilter = () => {
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const content = e.target.value;
    dispatch(changeFilter(content));
  };

  return (
    <div style={{ marginBottom: "10" }}>
      Filter <input type="text" onChange={handleChange} />
    </div>
  );
};

export default AnecdoteFilter;
