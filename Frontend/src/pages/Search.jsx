//? ---------------| IMPORT LIBRARIES |---------------
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

//? ---------------| IMPORT COMPONENTS |---------------
import { Button, Label, Select, TextInput } from "flowbite-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//? ---------------| IMPORT MY OWN COMPONENTS |---------------
import { SEARCH_POSTS } from "../apis/post";
import PostCard from "../components/PostCard";

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
  //TODO const [showMore, setShowMore] = useState(false);

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

        // if (data.posts.length === 7) setShowMore(true);
        // else setShowMore(false);
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

    if (sidebarSearch.searchTerm && sidebarSearch.searchTerm !== null)
      urlParams.set("searchTerm", sidebarSearch.searchTerm);
    if (sidebarSearch.category && sidebarSearch.category !== null)
      urlParams.set("category", sidebarSearch.category);
    if (sidebarSearch.sort && sidebarSearch.sort !== null)
      urlParams.set("sort", sidebarSearch.sort);

    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  // const handleShowMore = async () => {
  //   const numberOfPosts = posts.length;
  //   const startIndex = numberOfPosts;
  //   const urlParams = new URLSearchParams(location.search);
  //   urlParams.set("startIndex", startIndex);
  //   const searchQuery = urlParams.toString();
  //   const res = await fetch(`/api/posts/get-posts?${searchQuery}`);
  //   if (!res.ok) {
  //     return;
  //   }
  //   if (res.ok) {
  //     const data = await res.json();
  //     setPosts([...posts, ...data.posts]);
  //     console.log(...posts);
  //     console.log(...data.posts);
  //     if (data.posts.length === 9) {
  //       setShowMore(true);
  //     } else {
  //       setShowMore(false);
  //     }
  //   }
  // };

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
              value={sidebarSearch.category ?? "uncategorized"}
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
              value={sidebarSearch.sort ?? "desc"}
              onChange={handleSearch}
              className="w-[256px]"
            >
              <option value="desc">LASTEST</option>
              <option value="asc">OLDEST</option>
            </Select>
          </div>

          <Button
            className="mt-2"
            outline
            gradientDuoTone="pinkToOrange"
            type="submit"
          >
            Apply Filter
          </Button>
        </form>
      </div>
      <div className="p-5 flex flex-col">
        <h1 className="text-3xl font-semibold">Results:</h1>
        <div className="gap-5 mt-5 flex flex-wrap">
          {!loading && posts.length === 0 && (
            <p className="italic text-lg text-gray-400">No posts found.</p>
          )}
          {loading && <p className="text-xl text-gray-500">Loading...</p>}
          {!loading &&
            posts?.map((post) => (
              <div key={post._id}>
                <PostCard post={post} />
              </div>
            ))}
        </div>
        {/* {showMore && (
          <button
            type="button"
            onClick={handleShowMore}
            className="text-gray-700 hover:text-teal-700 dark:text-white   dark:hover:text-slate-700 mt-7 mb-2 font-medium rounded-full text-xl px-5 py-2.5 me-2 "
          >
            Show More
          </button>
        )} */}
      </div>
    </div>
  );
};

export default Search;
