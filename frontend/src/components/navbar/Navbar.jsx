import React, { useState, useEffect } from "react";
import "./Navbar.css";
import { GiWhiteBook } from "react-icons/gi";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { authActions } from "../../store";
import axios from "axios";  // Add axios import for API calls
import { AiOutlineClose } from "react-icons/ai"; // Import close icon


const Navbar = ({ onSearch }) => {
  const isLoggedIn = useSelector((state) => state.isLoggedIn);
  const dispatch = useDispatch();
  const userId = sessionStorage.getItem("id"); // Assuming you store user ID in session
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchPerformed, setSearchPerformed] = useState(false); // New state for tracking search
  const [tags, setTags] = useState([]); // State to store tags
  const navigate = useNavigate();

  const logout = () => {
    sessionStorage.clear("id");
    dispatch(authActions.logout());
  };

  useEffect(() => {
    // Fetch tags from backend
    const fetchTags = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/v2/tags');
        setTags(response.data.tags);
      } catch (error) {
        console.error("Error fetching tags", error);
      }
    };
    fetchTags();
  }, []);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchClick = async () => {
    setSearchPerformed(true); // Set searchPerformed to true when search is clicked
    try {
      const response = await axios.get('http://localhost:3000/api/v2/searchTasks', {
        params: { query: searchQuery, userId }
      });
      setSearchResults(response.data.tasks || []);
    } catch (error) {
      console.error("Error searching tasks", error);
    }
  };

  const clearSearchResults = () => {
    setSearchResults([]);
    setSearchQuery('');
    setSearchPerformed(false); // Reset searchPerformed when clearing results
  };

  const handleTagClick = (tag) => {
    navigate(`/tags/${tag}`);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand" to="#">
          <b className="brand-text"><GiWhiteBook /> scheduler</b>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            {isLoggedIn && (
              <>
                <li className="nav-item mx-2 search-bar">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search tasks..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                  <button
                    className="btn"
                    onClick={handleSearchClick}
                  >
                    Search
                  </button>
                </li>
              </>)}
            <li className="nav-item mx-2">
              <Link className="nav-link" aria-current="page" to="/home">
                Home
              </Link>
            </li>
            <li className="nav-item mx-2">
              <Link className="nav-link" aria-current="page" to="/about">
                About Us
              </Link>
            </li>
            <li className="nav-item mx-2">
              <Link className="nav-link" aria-current="page" to="/todo">
                Todo
              </Link>
            </li>
            {isLoggedIn && (
              <>
                <li className="nav-item dropdown mx-2">
                  <Link
                    className="nav-link dropdown-toggle"
                    to="#"
                    id="navbarDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    Categories
                  </Link>
                  <div className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                    {tags.map((tag) => (
                      <button key={tag} className="dropdown-item" onClick={() => handleTagClick(tag)}>
                        {tag}
                      </button>
                    ))}
                  </div>
                </li>
              </>
            )}

            {!isLoggedIn && (
              <>
                <li className="nav-item mx-2">
                  <Link
                    className="nav-link active btn-nav p-2"
                    aria-current="page"
                    to="/signup"
                  >
                    SignUp
                  </Link>
                </li>
                <li className="nav-item mx-2">
                  <Link
                    className="nav-link active btn-nav p-2"
                    aria-current="page"
                    to="/signin"
                  >
                    SignIn
                  </Link>
                </li>
              </>
            )}
            {isLoggedIn && (
              <>
                <li className="nav-item mx-2" onClick={logout}>
                  <Link
                    className="nav-link active btn-nav p-2"
                    aria-current="page"
                    to="#"
                  >
                    Log Out
                  </Link>
                </li>
              </>)}

          </ul>
        </div>
      </div>
      {(searchResults.length > 0 || searchPerformed) && (
        <div className="search-results">
          <button className="clear-search-btn" onClick={clearSearchResults}>
            <AiOutlineClose />
          </button>
          {searchResults.length > 0 ? (
            searchResults.map(task => (
              <div key={task._id} className="search-result-item">
                <h5>{task.title}</h5>
                <p>{task.body}</p>
              </div>
            ))
          ) : (
            <p>No results found</p> // Show "No results found" when no tasks are found
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
