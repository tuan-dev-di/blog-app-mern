//? ---------------| IMPORT LIBRARIES |---------------
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

//? ---------------| IMPORT COMPONENTS |---------------
import { Button, Label, Select, TextInput } from "flowbite-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//? ---------------| IMPORT MY OWN COMPONENTS |---------------
import { SEARCH_POSTS } from "../apis/post";

const Search = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [sidebarSearch, setSidebarSearch] = useState({
    searchTerm: "",
    category: "uncategorized",
    sort: "desc",
  });
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showmore, setShowmore] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromURL = urlParams.get("searchTerm");
    const categoryFromURL = urlParams.get("category");
    const sortFromURL = urlParams.get("sort");

    setSidebarSearch((prev) => {
      const isSame =
        prev.searchTerm === searchTermFromURL &&
        prev.category === categoryFromURL &&
        prev.sort === sortFromURL;

      if (isSame) return prev;

      return {
        ...prev,
        searchTerm: searchTermFromURL,
        category: categoryFromURL,
        sort: sortFromURL,
      };
    });

    const fetchPosts = async () => {
      setLoading(true);
      try {
        const searchQuery = urlParams.toString();
        const data = await SEARCH_POSTS(searchQuery);

        if (!data) toast.error(data.message, { theme: "colored" });

        setPosts(data.posts);
        setLoading(false);

        if (data.posts.length === 9) setShowmore(true);
        else setShowmore(false);
      } catch (error) {
        console.log("Get post error:", error.message);
        toast.error(error.message, { theme: "colored" });
      }
    };
    fetchPosts();
  }, [location.search]);

  const handleSearch = (e) => {
    if (e.target.id === "title")
      setSidebarSearch({ ...sidebarSearch, searchTerm: e.target.value });
    if (e.target.id === "category") {
      const category = e.target.value || "uncategorized";
      setSidebarSearch({ ...sidebarSearch, category });
    }
    if (e.target.id === "sort") {
      const sort = e.target.value || "desc";
      setSidebarSearch({ ...sidebarSearch, sort });
    }
  };

  const handleSubmitSearch = (e) => {
    e.preventDefault();

    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", sidebarSearch.searchTerm);
    urlParams.set("category", sidebarSearch.category);
    urlParams.set("sort", sidebarSearch.sort);

    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  return (
    <div className="flex flex-col md:flex-row">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="p-7 md:min-h-screen md:border-r border-gray-500">
        <form className="flex flex-col" onSubmit={handleSubmitSearch}>
          <div className="flex p-2 gap-2 items-center">
            <Label
              className="text-xl font-semibold w-24 text-right"
              value="Title:"
            />
            <TextInput
              id="title"
              value={sidebarSearch.searchTerm}
              onChange={handleSearch}
              placeholder="Title searching"
              type="text"
              className="w-[256px]"
            />
          </div>

          <div className="flex p-2 gap-2 items-center">
            <Label
              className="text-xl font-semibold w-24 text-right"
              value="Category:"
            />
            <Select
              id="category"
              value={sidebarSearch.category}
              onChange={handleSearch}
            >
              <option value="uncategorized">
                ----- Language | Framework -----
              </option>
              <option value="javascript-vuejs">JavaScript | VueJS</option>
              <option value="javascript-reactjs">JavaScript | ReactJS</option>
              <option value="javascript-nodejs">JavaScript | NodeJS</option>
              <option value="golang-gin">GoLang | Gin</option>
              <option value="golang-echo">GoLang | Echo</option>
              <option value="golang-fiber">GoLang | Fiber</option>
            </Select>
          </div>

          <div className="flex p-2 gap-2 items-center">
            <Label
              className="text-xl font-semibold w-24 text-right"
              value="Sort:"
            />
            <Select
              id="sort"
              value={sidebarSearch.sort}
              onChange={handleSearch}
              className="w-[256px]"
            >
              <option value="desc">LASTEST</option>
              <option value="asc">OLDEST</option>
            </Select>
          </div>

          <Button
            className=" mt-2"
            outline
            gradientDuoTone="pinkToOrange"
            type="submit"
          >
            Apply Filter
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Search;
