import { useParams } from "react-router-dom";

function CategoryPage() {
  const { slug } = useParams();

  return <div className="container"><h1>Thể loại: {slug}</h1></div>;
}

export default CategoryPage;