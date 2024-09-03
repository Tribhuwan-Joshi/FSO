import { useDispatch, useSelector } from "react-redux";
import { filterChange } from "../reducers/filterReducer";

const VisibilityFilter = () => {
  const dispatch = useDispatch();
  const currentFilter = useSelector((state) => state.filter);

  return (
    <div>
      all
      <input
        checked={currentFilter == "ALL"}
        type="radio"
        name="filter"
        onChange={() => dispatch(filterChange("ALL"))}
      />
      important
      <input
        checked={currentFilter == "IMPORTANT"}
        type="radio"
        name="filter"
        onChange={() => dispatch(filterChange("IMPORTANT"))}
      />
      nonimportant
      <input
        checked={currentFilter == "NONIMPORTANT"}
        type="radio"
        name="filter"
        onChange={() => dispatch(filterChange("NONIMPORTANT"))}
      />
    </div>
  );
};

export default VisibilityFilter;
