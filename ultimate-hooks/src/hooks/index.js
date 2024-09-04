import { useEffect, useState } from "react";
import axios from "axios";
const useField = (type) => {
  const [value, setValue] = useState("");

  const onChange = (event) => {
    setValue(event.target.value);
  };
  const onReset = () => {
    setValue("");
  };
  return {
    type,
    value,
    onChange,
    onReset,
  };
};

const useResource = (baseUrl) => {
  const [resources, setResources] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);

    axios.get(baseUrl).then((res) => {
      setResources(res.data);
      setIsLoading(false);
    });
  }, [baseUrl]);

  const create = async (resource) => {
    setIsLoading(true);
    const res = await axios.post(baseUrl, resource);
    const newResources = resources.concat(res.data);
    setResources(newResources);
    setIsLoading(false);
  };

  const service = {
    create,
  };

  return [{ resources, isLoading }, service];
};

export { useField, useResource };
