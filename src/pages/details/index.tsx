import { useParams } from "react-router-dom";

export const DetailsPage = () => {
  const params = useParams();
  return (
    <div>
      <a href="/" className="btn btn-primary float-end">Back</a>
      <div>{params.element}</div>
    </div>
  );
};
